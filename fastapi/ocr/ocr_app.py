import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
import uuid
import time
import openai
import re
import pandas as pd
from difflib import get_close_matches
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text

# 환경 변수 로드
load_dotenv()

app = FastAPI()

# 환경 변수에서 API 키 로드
openai.api_key = os.getenv("OPENAI_API_KEY")
OCR_SECRET_KEY = os.getenv("OCR_SECRET_KEY")
APIGW_URL = os.getenv("APIGW_URL")
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def load_ingredients_from_db() -> pd.DataFrame:
    try:
        query = text("""
            SELECT ingredient_name AS kor,
                   rating,
                   effect,
                   category
            FROM ingredient
            WHERE status = 1
        """)
        df = pd.read_sql(query, con=engine)
        return df
    except Exception as e:
        print(f"DB 쿼리 오류: {e}")
        return pd.DataFrame()

# DB에서 불러온 성분 목록 (공백 제거 버전)
ingredients_df = load_ingredients_from_db()
# DB의 성분명은 공백 제거된 형태로 비교
known_ingredients = ingredients_df["kor"].dropna().str.replace(" ", "", regex=True).tolist()

def clean_value(value):
    return "Unknown" if pd.isna(value) else value

def correct_ingredient_name(name, known_names):
    """
    fuzzy matching을 이용하여 known_names와 가장 유사한 값을 반환.
    이미 정규화된 값이 있다면 그대로 반환됨.
    """
    matches = get_close_matches(name, known_names, n=1, cutoff=0.7)
    return matches[0] if matches else name

def clean_gpt_response(response_text: str) -> str:
    """
    GPT 응답 내 마크다운 코드 블록(예: ```json ... ```) 제거
    """
    response_text = response_text.strip()
    if response_text.startswith("```"):
        lines = response_text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().endswith("```"):
            lines = lines[:-1]
        response_text = "\n".join(lines)
    return response_text

def process_candidate(candidate: str, known_names: list) -> list:
    """
    candidate 문자열에 대해
    1. 전체가 DB에 존재하면 그대로 반환.
    2. 그렇지 않으면, 숫자 사이의 콤마는 분리하지 않고 나머지 콤마에 대해 분리.
    """
    candidate_clean = candidate.strip()
    candidate_nospace = candidate_clean.replace(" ", "")
    if candidate_nospace in known_names:
        return [candidate_clean]
    
    # 숫자 사이의 콤마는 분리하지 않도록 정규식 사용
    parts = re.split(r',\s*(?!\d)', candidate_clean)
    result = []
    for part in parts:
        part_clean = part.strip()
        part_nospace = part_clean.replace(" ", "")
        if part_nospace in known_names:
            result.append(part_clean)
        else:
            match = get_close_matches(part_nospace, known_names, n=1, cutoff=0.7)
            result.append(match[0] if match else part_clean)
    return result

def normalize_ingredient(candidate: str, known_names: list) -> str:
    """
    괄호가 포함된 경우 DB에 정확히 일치하는지 확인:
    - 일치하면 그대로 반환
    - 없으면 괄호와 그 내부를 제거한 후 DB와 비교하여 반환
    """
    candidate_clean = candidate.strip()
    candidate_nospace = candidate_clean.replace(" ", "")
    if candidate_nospace in known_names:
        return candidate_clean
    # 괄호 및 내부 제거
    candidate_no_paren = re.sub(r'\([^)]*\)', '', candidate_clean).strip()
    candidate_no_paren_nospace = candidate_no_paren.replace(" ", "")
    if candidate_no_paren_nospace in known_names:
        return candidate_no_paren
    else:
        # 유사도 기준으로 보정
        best = get_close_matches(candidate_no_paren_nospace, known_names, n=1, cutoff=0.7)
        return best[0] if best else candidate_no_paren

def fallback_parse(text: str):
    """
    GPT가 JSON 형식을 제대로 반환하지 않았을 때의 fallback 로직.
    '전성분' 이후 텍스트에서 지정된 키워드 전까지 추출한 후
    process_candidate()를 이용해 분리
    """
    if "전성분" in text:
        ingredients_section = text.split("전성분", 1)[1].strip()
    else:
        ingredients_section = text.strip()

    end_markers = ["사용할 때의 주의사항", "본 제품에 이상이 있을 경우"]
    for marker in end_markers:
        if marker in ingredients_section:
            ingredients_section = ingredients_section.split(marker, 1)[0].strip()
            break
    return [{"ingredient": part} for part in process_candidate(ingredients_section, known_ingredients)]

# 요청 데이터 모델
class CosmeticRequest(BaseModel):
    image: str  # 이미지 URL

@app.post("/img_ocr")
def img_ocr(request: CosmeticRequest):
    # 1) 클로바 OCR 요청
    ocr_request_payload = {
        "version": "V2",
        "requestId": str(uuid.uuid4()),
        "timestamp": int(time.time() * 1000),
        "images": [{
            "format": "jpg",
            "name": "sample",
            "url": request.image
        }]
    }
    payload_json = json.dumps(ocr_request_payload)

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-OCR-SECRET": OCR_SECRET_KEY
    }

    try:
        ocr_response = requests.post(APIGW_URL, headers=headers, data=payload_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Clova OCR 요청 실패: {e}")

    if ocr_response.status_code != 200:
        raise HTTPException(status_code=ocr_response.status_code,
                            detail=f"Clova OCR API 오류: {ocr_response.text}")

    try:
        ocr_result = ocr_response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 응답 JSON 파싱 실패: {e}")

    # 2) OCR 결과에서 텍스트 추출
    raw_texts = []
    if "images" in ocr_result:
        images = ocr_result["images"]
        if isinstance(images, list) and len(images) > 0:
            fields = images[0].get("fields", [])
            if isinstance(fields, list):
                for field in fields:
                    if "inferText" in field:
                        raw_texts.append(field["inferText"])
    ocr_text = " ".join(raw_texts)
    # ,와 .가 혼용된 경우 올바르게 처리
    ocr_text = re.sub(r'([가-힣a-zA-Z]+)\.\s*([가-힣a-zA-Z]+)', r'\1, \2', ocr_text)

    # 3) GPT에게 JSON 배열로 전성분 데이터를 반환 요청
    prompt = (
        "다음 텍스트에서 전성분 데이터를 추출해줘. "
        "전성분 이후의 내용부터 전성분 데이터로 인식해줘. "
        "전성분 데이터는 콤마(',')로 구분되어 있으나, 성분명 내부의 콤마(예: 1,2-헥산다이올)는 분리하면 안 돼. "
        "또한, '사용할 때의 주의사항' 또는 '본 제품에 이상이 있을 경우' 등의 문구가 나오면 그 이전까지만 성분으로 처리해줘. "
        "최종 결과는 JSON 형식의 배열로 제공해줘. 예시: "
        "[{\"ingredient\": \"정제수\"}, {\"ingredient\": \"글리세린\"}, ...]\n\n"
        f"{ocr_text}"
    )

    try:
        chat_messages = [{"role": "user", "content": prompt}]
        openai_resp = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=chat_messages,
            max_tokens=2000,
            temperature=0.5,
        )
        assistant_response = openai_resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API 호출 오류: {e}")

    # 4) 마크다운 코드 블록 제거 후 JSON 파싱 시도
    cleaned_response = clean_gpt_response(assistant_response)
    try:
        extracted_ingredients = json.loads(cleaned_response)
        if not isinstance(extracted_ingredients, list):
            raise ValueError("JSON 배열 형태가 아닙니다.")
    except Exception:
        extracted_ingredients = fallback_parse(cleaned_response)

    # 5) 각 항목에 대해 DB 존재 여부 및 괄호 처리 적용
    final_ingredients = []
    for item in extracted_ingredients:
        if isinstance(item, dict) and "ingredient" in item:
            ing_text = item["ingredient"]
        elif isinstance(item, str):
            ing_text = item
        else:
            continue
        # process_candidate로 후보 분리
        candidates = process_candidate(ing_text, known_ingredients)
        for cand in candidates:
            # normalize_ingredient에서 괄호 포함 여부를 확인 후 반환
            normalized = normalize_ingredient(cand, known_ingredients)
            # 추가로 fuzzy matching
            final = correct_ingredient_name(normalized.replace(" ", ""), known_ingredients)
            final_ingredients.append({"name": final})

    return {"ingredients": final_ingredients}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)