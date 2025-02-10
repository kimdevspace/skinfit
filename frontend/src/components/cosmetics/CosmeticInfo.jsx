import React from "react";
import "./CosmeticInfo.scss";
import skinAnalysisIcon from "../../assets/images/skin_analysis_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function CosmeticInfo() {
  return (
    <div className="cosmetic-info">
      {/* 화장품 이미지 */}
      <div className="cosmetic-img-box">
        <img src="" alt="" />
        <p className="badge caution">뱃지</p>
      </div>

      {/* 화장품 주요 정보 */}
      <div className="cosmetic-info-text">
        <div className="category">카테고리</div>
        <div className="brand-name">브랜드명</div>
        <div className="cosmetic-name">화장품명</div>
      </div>

      {/* 내 피부 분석 박스 */}
      <div className="skin-analysis-box">
        <img src={skinAnalysisIcon} alt="skin-analysis-icon" />
        <p className="title">내 피부 분석</p>
        {/* 민감 성분 있을 때 */}
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
            <div className="analysis analysis-result">
              <p className="ingredient-name">히알루론산</p>
              <p className="found-count">2회</p>
              <p className="ewg-score">7</p>
            </div>
            <div className="analysis analysis-result">
              <p className="ingredient-name">히알루론산</p>
              <p className="found-count">2회</p>
              <p className="ewg-score">7</p>
            </div>
            <p className="found-count-info">
              <FontAwesomeIcon icon={faCircleQuestion} />
              내가 등록한 맞지 않는 화장품 데이터를 토대로 면밀히 찾아줘요
            </p>
          </div>
        </div>
        {/* 민감 성분 없을 때 */}
        <div className="safe-ingredients">
          <p className="info-msg">내 피부에 민감한 성분이 없어요 😊</p>
        </div>
      </div>
    </div>
  );
}

export default CosmeticInfo;
