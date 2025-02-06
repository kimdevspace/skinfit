import { useState } from "react";
import './Home.scss'
import Logo from "../../components/common/Logo"
import RecommendItem from "../../components/home/RecommendItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";


function Home() {

  return (
    <div className="home">
      <Logo/>

      {/* 검색바 */}
      <div className="serch-bar">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <p>검색어를 입력하세요</p>
      </div>

      {/* 피부 분석 정확도 박스 */}
      <div className="analysis-accuracy">
        <div className="analysis-accuracy-txt-box">
          <p className="title">내 피부 분석 정확도</p>
          <button>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
        </div>
        
        <div className="analysis-accuracy-info-box">
          {/* 분석 정확도 */}
          <div className="accuracy-level-box">
            <div className="heart"></div>
            <p className="level">Level 뭐뭐뭐</p>
          </div>
          {/* 화장품 개수 박스 */}
          <div className="cosmetic-box">
            <div className="cosmetic-count-box">
              <div className="good-cosmetic">
                <p className="sub-title">나와 잘 맞는<br/>화장품</p>
                <p className="count">3개</p>
              </div>
              <div className="bad-cosmetic">
                <p className="sub-title">나와 맞지 않는<br/>화장품</p>
                <p className="count">5개</p>
              </div>
            </div>
            <button className="cosmetic-register-btn">화장품 등록하기</button>
          </div>
        </div>
      </div>

      {/* 추천 화장품 박스 */}
      <div className="recommend-cosmetic">
        <p className="title"><span className="nickname">먀먀</span>님의 추천 화장품</p>
        <div className="recommend-list">
          <RecommendItem/>
          <RecommendItem/>
          <RecommendItem/>
        </div>
      </div>
    </div>
  );
}

export default Home;
