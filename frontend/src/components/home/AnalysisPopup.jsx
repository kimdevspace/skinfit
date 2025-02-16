import React from "react";
import "./AnalysisPopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import level1Img from "../../assets/images/level1.png";
import level2Img from "../../assets/images/level2.png";
import level3Img from "../../assets/images/level3.png";

function AnalysisPopup({ closePopup }) {
  const accuracyInfo = [
    { img: level1Img, count: "2-5개" },
    { img: level2Img, count: "6-10개" },
    { img: level3Img, count: "11개 이상" },
  ];

  return (
    <div className="analysis-popup-overlay">
      <div className="analysis-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 피부 분석 정확도 안내 문구 */}
        <p className="popup-title">내 피부분석 정확도란?</p>
        <p className="popup-discription">
          내가 등록한 화장품 개수를 기준으로 Level을 부여해요
          <br />
          레벨이 높을수록 정확도가 올라가요
        </p>

        {/* level 설명 박스 */}
        <div className="level-guide-box">
          {accuracyInfo.map((info, idx) => (
            <div className="level-guide" key={idx}>
              <p className="level-text">Level {idx + 1}</p>
              <img
                src={info.img}
                alt={`level-img${idx + 1}`}
                className="level-img"
              />
              <p className="count">
                화장품 등록개수 <span>{info.count}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalysisPopup;
