import React from "react";
import "./CosmeticInfo.scss";
import skinAnalysisIcon from "../../assets/images/skin_analysis_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function CosmeticInfo({ cosmeticData }) {
  return (
    <div className="cosmetic-info">
      {/* 화장품 이미지 */}
      <div className="cosmetic-img-box">
        <img
          src={cosmeticData.imageUrl}
          alt={`${cosmeticData.cosmeticName}-img`}
        />
        <p className="badge caution">
          {cosmeticData.ingredients.length ? "유의" : "안전"}
        </p>
      </div>

      {/* 화장품 주요 정보 */}
      <div className="cosmetic-info-text">
        <div className="category">{cosmeticData.category}</div>
        <div className="brand-name">{cosmeticData.cosmeticBrand}</div>
        <div className="cosmetic-name">{cosmeticData.cosmeticName}</div>
      </div>

      {/* 내 피부 분석 박스 */}
      <div className="skin-analysis-box">
        <img src={skinAnalysisIcon} alt="skin-analysis-icon" />
        <p className="title">내 피부 분석</p>
        {cosmeticData.ingredients.length ? (
          // 민감 성분 있을 때
          <div className="sensitive-ingredients">
            <p className="info-msg">
              내가 써본 화장품에서 민감성분이 발견된 횟수예요
            </p>
            {/* 민감성분 분석 */}
            <div className="skin-analysis">
              <div className="analysis analysis-title">
                <p className="ingredient-name">성분명</p>
                <p className="found-count">
                  발견 횟수 <FontAwesomeIcon icon={faCircleQuestion} />
                </p>
                <p className="ewg-score">
                  안전 등급 <FontAwesomeIcon icon={faCircleInfo} />
                </p>
              </div>
              {cosmeticData.ingredients.map((ingredient, idx) => (
                <div key={idx} className="analysis analysis-result">
                  <p className="ingredient-name">
                    {ingredient.ingredient_name}
                  </p>
                  <p className="found-count">
                    {ingredient.found_count
                      ? `${ingredient.found_count}회`
                      : "-"}
                  </p>
                  <p className={`ewg-score ${
                    ingredient.ewg_score_max <= 2
                      ? "low"
                      : ingredient.ewg_score_max <= 6
                      ? "moderate"
                      : "high"
                  }`}
                >
                  {ingredient.ewg_score_min === null
                    ? `${ingredient.ewg_score_max}`
                    : `${ingredient.ewg_score_min} - ${ingredient.ewg_score_max}`}
                </p>
                </div>
              ))}
              <p className="found-count-info">
                <FontAwesomeIcon icon={faCircleQuestion} />
                내가 등록한 맞지 않는 화장품 데이터를 토대로 면밀히 찾아줘요
              </p>
            </div>
          </div>
        ) : (
          // 민감 성분 없을 때
          <div className="safe-ingredients">
            <p className="info-msg">내 피부에 민감한 성분이 없어요 😊</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CosmeticInfo;
