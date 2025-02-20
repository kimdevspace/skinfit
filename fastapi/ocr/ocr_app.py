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
            SELECT ingredient_name AS kor
            FROM ingredient
            WHERE status = 1
        """)
        df = pd.read_sql(query, con=engine)
        return df
    except Exception as e:
        print(f"DB 쿼리 오류: {e}")
        return pd.DataFrame()


# CSV 파일 경로 (필요에 따라 수정)
ingredients_df = load_ingredients_from_db()


# NaN 값을 처리하는 함수 추가
def clean_value(value):
    return "Unknown" if pd.isna(value) else value


# 유사한 성분명을 찾는 함수
def correct_ingredient_name(name, known_names):
    matches = get_close_matches(name, known_names, n=1, cutoff=0.7)
    return matches[0] if matches else name


# 요청 데이터 모델
class CosmeticRequest(BaseModel):
    image: str  # 이미지 URL


@app.post("/img_ocr")
def img_ocr(request: CosmeticRequest):
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

    prompt = (
        "다음 텍스트에서 전성분 데이터를 추출해줘. "
        "전성분 이후의 내용부터 전성분 데이터로 인식해줘. "
        "전성분 데이터는 콤마(',')로 구분되어 있으나, 성분명 내부의 콤마는 분리하면 안 돼. "
        "또한, '사용할 때의 주의사항' 또는 '본 제품에 이상이 있을 경우' 등의 문구가 나오면 그 이전까지만 성분으로 처리해줘.\n\n"
        f"{ocr_text}"
    )

    try:
        chat_messages = [{"role": "user", "content": prompt}]
        openai_resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_messages,
            max_tokens=2000,
            temperature=0.5,
        )
        refined_text = openai_resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API 호출 오류: {e}")

    if "전성분" in refined_text:
        ingredients_section = refined_text.split("전성분", 1)[1].strip()
    else:
        ingredients_section = refined_text.strip()

    end_markers = ["사용할 때의 주의사항", "본 제품에 이상이 있을 경우"]
    for marker in end_markers:
        if marker in ingredients_section:
            ingredients_section = ingredients_section.split(marker, 1)[0].strip()
            break

    ingredients_list = re.split(r',\s+', ingredients_section)
    ingredients_list = [ing.replace(" ", "") for ing in ingredients_list]

    known_ingredients = ingredients_df["kor"].dropna().str.replace(" ", "", regex=True).tolist()

    matched_ingredients = []
    for ing in ingredients_list:
        corrected_ing = correct_ingredient_name(ing, known_ingredients)
        match = ingredients_df[ingredients_df["kor"].str.replace(" ", "", regex=True) == corrected_ing]
        if not match.empty:
            matched_ingredients.append({"name": corrected_ing})
        else:
            matched_ingredients.append({"name": corrected_ing})

    return {"ingredients": matched_ingredients}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
