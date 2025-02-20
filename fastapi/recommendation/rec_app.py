import math
import uvicorn
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
import redis
import os
import json

# MySQL 접속정보 (실제 환경에 맞게 수정)
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

redis_client = redis.Redis(host='172.17.0.6', port=6379, db=0, decode_responses=True, password='redis')

app = FastAPI()

# 요청 바디를 위한 Pydantic 모델
class RecommendationRequest(BaseModel):
    userId: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """두 벡터의 코사인 유사도를 계산"""
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

@app.post("/recommend_cosmetics")
def recommend_cosmetics(request: RecommendationRequest, db: Session = Depends(get_db)):
    # 요청 바디에서 user_id 추출
    user_id = request.userId
    
    """
    2차 필터링 (협업 필터링):
      ① 1차 필터링을 통해 로그인한 사용자의 제품 경험 및 직접 등록한 성분 경험에서
         안전 성분(잘 맞음, is_suitable=1)과 주의 성분(맞지 않음, is_suitable=0)을 산출.
         (주의 성분은 두 출처에서 합친 후, 안전 성분이 포함된 경우 제외)
      ② 후보 화장품은 사용자가 경험하지 않은 활성 제품 중 주의 성분이 포함되지 않은 제품으로 선정하고,
         각 후보에 대해 코사인 유사도를 계산하여 base_similarity를 산출.
      ③ 로그인한 사용자와 나이 ±5, 동일 피부 타입을 가진 유사 사용자들 중
         각 유사 사용자의 주의 성분 데이터(P_E와 I_E 모두)를 산출하고,
         이들 중 로그인한 사용자의 주의 성분과 3개 이상 겹치는 사용자들을 qualified_sim_users로 선정.
      ④ qualified_sim_users가 해당 화장품에 대해 남긴 제품 경험 데이터를 활용하여
         “잘 맞는” 평가는 +, “맞지 않는” 평가는 – 가중치(예: 0.05씩)를 부여.
      ⑤ 최종 점수는 base_similarity에 보정 가중치를 더한 값(final_score)으로 산출하며,
         이를 내림차순 정렬하여 최종 추천 결과를 JSON으로 반환.
    """

    # -------------------------
    # ① 1차 필터링: 로그인 사용자 안전/주의 성분 추출
    # (1-1) 제품 경험으로부터 안전 성분 (is_suitable = 1)
    safe_query = text("""
        SELECT DISTINCT ci.ingredient_id
        FROM cosmetic_experience ce
        JOIN cosmetic_ingredient ci ON ce.cosmetic_id = ci.cosmetic_id
        WHERE ce.user_id = :user_id AND ce.is_suitable = 1
    """)
    safe_result = db.execute(safe_query, {"user_id": user_id})
    safe_from_cosmetic = {row[0] for row in safe_result}

    # (1-2) 직접 등록한 성분 경험으로부터 안전 성분 (is_suitable = 1)
    safe_ing_direct_query = text("""
        SELECT DISTINCT ingredient_id
        FROM ingredient_experience
        WHERE user_id = :user_id AND is_suitable = 1
    """)
    safe_direct_result = db.execute(safe_ing_direct_query, {"user_id": user_id})
    safe_from_direct = {row[0] for row in safe_direct_result}        
    safe_ingredients = safe_from_cosmetic.union(safe_from_direct)

    # (2-1) 제품 경험에서 주의 성분 (is_suitable = 0)
    caution_query = text("""
        SELECT DISTINCT ci.ingredient_id
        FROM cosmetic_experience ce
        JOIN cosmetic_ingredient ci ON ce.cosmetic_id = ci.cosmetic_id
        WHERE ce.user_id = :user_id AND ce.is_suitable = 0
    """)
    caution_result = db.execute(caution_query, {"user_id": user_id})
    caution_from_cosmetic = {row[0] for row in caution_result}

    # (2-2) 직접 등록한 성분 경험에서 주의 성분 (is_suitable = 0)
    caution_ing_direct_query = text("""
        SELECT DISTINCT ingredient_id
        FROM ingredient_experience
        WHERE user_id = :user_id AND is_suitable = 0
    """)
    caution_direct_result = db.execute(caution_ing_direct_query, {"user_id": user_id})
    caution_from_direct = {row[0] for row in caution_direct_result}

    # 주의 성분: 두 출처의 결과를 합치되, 안전 성분은 제외
    caution_all = caution_from_cosmetic.union(caution_from_direct)
    caution_ingredients = caution_all - safe_ingredients

    # 벡터 차원: 안전 성분 ∪ 주의 성분
    vector_dims = list(safe_ingredients.union(caution_ingredients))
    vector_dims.sort()

    # 사용자 선호도 벡터: 해당 성분이 안전이면 +1, 주의이면 -1
    user_vector = [1 if ing in safe_ingredients else -1 for ing in vector_dims]

    # ① 후보 화장품 조회: 사용자가 경험하지 않은 활성 제품(status=1)
    candidate_query = text("""
        SELECT cosmetic_id, cosmetic_name
        FROM cosmetic
        WHERE status = 1 AND cosmetic_id NOT IN (
            SELECT cosmetic_id FROM cosmetic_experience WHERE user_id = :user_id
        )
    """)
    candidate_result = db.execute(candidate_query, {"user_id": user_id})
    candidates = candidate_result.fetchall()


    base_candidates = []
    for candidate in candidates:
        cosmetic_id, cosmetic_name = candidate

        # 해당 화장품의 성분 조회
        ing_query = text("""
            SELECT ingredient_id
            FROM cosmetic_ingredient
            WHERE cosmetic_id = :cosmetic_id
        """)
        ing_result = db.execute(ing_query, {"cosmetic_id": cosmetic_id})
        cosmetic_ings = {row[0] for row in ing_result}

        # 만약 후보 화장품에 로그인 사용자의 주의 성분이 포함되면 제외
        if cosmetic_ings.intersection(caution_ingredients):
            continue

        # 후보 화장품 벡터: vector_dims 기준 이진 벡터 (해당 성분 있으면 1, 없으면 0)
        cosmetic_vector = [1 if ing in cosmetic_ings else 0 for ing in vector_dims]
        base_sim = cosine_similarity(user_vector, cosmetic_vector)

        base_candidates.append({
            "cosmetic_id": cosmetic_id,
            "cosmetic_name": cosmetic_name,
            "base_similarity": base_sim,
            "cosmetic_ings": cosmetic_ings  # 보정 시 재사용
        })

    # -------------------------
    # ② 유사 사용자 추출 (나이 ±5, 동일 피부 타입)
    sim_users_query = text("""
        SELECT u.user_id
        FROM user u
        JOIN user_skin_type ust ON u.user_id = ust.user_id
        WHERE ust.type_id IN (
            SELECT type_id FROM user_skin_type WHERE user_id = :user_id
        )
          AND ABS(CAST(u.birth_year AS SIGNED) - CAST((SELECT birth_year FROM user WHERE user_id = :user_id) AS SIGNED)) <= 5
          AND u.user_id != :user_id
    """)
    sim_users_result = db.execute(sim_users_query, {"user_id": user_id})
    sim_user_ids = [row[0] for row in sim_users_result]

    # ②-1. 유사 사용자들 중, 로그인 사용자의 주의 성분과 3개 이상 동일한 주의 성분을 가진 사용자만 선정
    qualified_sim_users = []
    for sim_user in sim_user_ids:
        # 유사 사용자 제품 경험에서 주의 성분 (is_suitable=0)
        sim_caution_query = text("""
            SELECT DISTINCT ci.ingredient_id
            FROM cosmetic_experience ce
            JOIN cosmetic_ingredient ci ON ce.cosmetic_id = ci.cosmetic_id
            WHERE ce.user_id = :sim_user AND ce.is_suitable = 0
        """)
        sim_caution_result = db.execute(sim_caution_query, {"sim_user": sim_user})
        sim_caution_from_cosmetic = {row[0] for row in sim_caution_result}

        # 유사 사용자의 직접 등록 성분 경험에서 주의 성분 (is_suitable=0)
        sim_caution_direct_query = text("""
            SELECT DISTINCT ingredient_id
            FROM ingredient_experience
            WHERE user_id = :sim_user AND is_suitable = 0
        """)
        sim_caution_direct_result = db.execute(sim_caution_direct_query, {"sim_user": sim_user})
        sim_caution_from_direct = {row[0] for row in sim_caution_direct_result}

        sim_caution_all = sim_caution_from_cosmetic.union(sim_caution_from_direct)
        # 유사 사용자의 안전 성분 (제외)
        sim_safe_query = text("""
            SELECT DISTINCT ci.ingredient_id
            FROM cosmetic_experience ce
            JOIN cosmetic_ingredient ci ON ce.cosmetic_id = ci.cosmetic_id
            WHERE ce.user_id = :sim_user AND ce.is_suitable = 1
        """)
        sim_safe_result = db.execute(sim_safe_query, {"sim_user": sim_user})
        sim_safe_from_cosmetic = {row[0] for row in sim_safe_result}

        sim_safe_direct_query = text("""
            SELECT DISTINCT ingredient_id
            FROM ingredient_experience
            WHERE user_id = :sim_user AND is_suitable = 1
        """)
        sim_safe_direct_result = db.execute(sim_safe_direct_query, {"sim_user": sim_user})
        sim_safe_from_direct = {row[0] for row in sim_safe_direct_result}

        sim_safe = sim_safe_from_cosmetic.union(sim_safe_from_direct)
        sim_caution_clean = sim_caution_all - sim_safe

        # 로그인 사용자의 caution_ingredients와 교집합 계산
        common_caution = sim_caution_clean.intersection(caution_ingredients)
        if len(common_caution) >= 3:
            qualified_sim_users.append(sim_user)

    # -------------------------
    # ③ 후보 화장품에 대해, qualified_sim_users의 제품 경험을 활용한 보정 가중치 적용
    positive_factor = 0.05
    negative_factor = 0.05

    final_candidates = []
    for candidate in base_candidates:
        cosmetic_id = candidate["cosmetic_id"]
        # qualified_sim_users가 해당 화장품에 대해 남긴 제품 경험 조회

        if not qualified_sim_users:
            adjustment = 0.0
        else:
            exp_query = text("""
                SELECT is_suitable, COUNT(*) AS cnt
                FROM cosmetic_experience
                WHERE cosmetic_id = :cosmetic_id AND user_id IN :sim_users
                GROUP BY is_suitable
            """)
            exp_result = db.execute(exp_query, {"cosmetic_id": cosmetic_id, "sim_users": tuple(qualified_sim_users)})
            adjustment = 0.0
            for row in exp_result:
                is_suit = row[0]
                count = row[1]
                if is_suit == 1:
                    adjustment += positive_factor * count
                else:
                    adjustment -= negative_factor * count

        final_score = candidate["base_similarity"] + adjustment
        candidate["adjustment"] = adjustment
        candidate["final_score"] = final_score
        final_candidates.append(candidate)

    # 내림차순 정렬
    final_candidates.sort(key=lambda x: x["final_score"], reverse=True)

    # 최종 결과에서 cosmetic_id 리스트를 추출하여 Redis에 저장 (키: "recommend:<user_id>")
    recommended_idss = [cand["cosmetic_id"] for cand in final_candidates]
    recommended_ids = ["java.util.Arrays$ArrayList", recommended_idss]

    redis_key = f"recommend:{user_id}"
    redis_client.delete(redis_key)
    
    # JSON 문자열로 저장
    redis_client.set(redis_key, json.dumps(recommended_ids))

    # 최종 결과: redis에 저장할 수 있으나, 여기서는 JSON 반환
    result = [{
        "cosmetic_id": cand["cosmetic_id"],
        "cosmetic_name": cand["cosmetic_name"],
        "base_similarity": cand["base_similarity"],
        "adjustment": cand["adjustment"],
        "final_score": cand["final_score"]
    } for cand in final_candidates]

    return {
        "user_id": user_id,
        "vector_dimensions": vector_dims,
        "user_vector": user_vector,
        "safe_ingredients": list(safe_ingredients),
        "caution_ingredients": list(caution_ingredients),
        "qualified_similar_user_ids": qualified_sim_users,
        "final_candidates": result,
        "redis_key": redis_key
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)