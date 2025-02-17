import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axiosInstance.js";
import "./Home.scss";
import Logo from "@/components/common/Logo";
import RecommendItem from "@/components/home/RecommendItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import NavBar from "@/components/common/NavBar";
import level1Img from "@/assets/images/Level1.png";
import level2Img from "@/assets/images/Level2.png";
import level3Img from "@/assets/images/Level3.png";
import AnalysisPopup from "@/components/home/AnalysisPopup.jsx";

function Home() {
  // 내 피부분석 정확도 팝업창 제어
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 메인 페이지(추천 상품, 화장품 정보) 필요한 정보 api 요청
  const fetchMainPageInfo = async () => {
    const response = await axios.get("mainpage");
    return response.data;
  };

  const {
    data: mainInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mainPageInfo"],
    queryFn: fetchMainPageInfo,
  });

  // api에서 받아온 정보 데이터
  const { level, goodCosmeticsCount, badCosmeticsCount, recommendedCosmetics } = mainInfo.data

  // 로딩, 에러 확인
  if (isLoading) {
    return console.log("로딩중", isLoading);
  }
  if (isError) {
    return console.log("에러", isError);
  }

  const levelImg = {
    1: level1Img,
    2: level2Img,
    3: level3Img,
  };

  // #region 내 피부분석 정확도 안내 팝업창 함수

  // 내 피부분석 정확도 팝업 열기
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // 내 피부분석 정확도 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // #endregion

  return (
    <div className="home">
      <header>
        <Logo />
        <div className="circle left-circle"></div>
        <div className="circle right-circle"></div>
      </header>

      {/* 검색바 */}
      <Link to="/search" className="serch-bar">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <p>검색어를 입력하세요</p>
      </Link>

      {/* 피부 분석 정확도 박스 */}
      <div className="analysis-accuracy">
        <div className="analysis-accuracy-txt-box">
          <p className="title">내 피부 분석 정확도</p>
          <button onClick={openPopup}>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
        </div>
        {/* 내 피부분석 정확도 안내 팝업 */}
        {isPopupOpen && <AnalysisPopup closePopup={closePopup} />}

        <div className="analysis-accuracy-info-box">
          {/* 분석 정확도 */}
          <div className="accuracy-level-box">
            <div className="heart">
              <img src={levelImg[level]} alt="" />
            </div>
            <p className="level">Level {level}</p>
          </div>
          {/* 화장품 개수 박스 */}
          <div className="cosmetic-box">
            <div className="cosmetic-count-box">
              <div className="good-cosmetic">
                <p className="sub-title">
                  잘 맞는
                  <br />
                  화장품
                </p>
                <p className="count">{goodCosmeticsCount}개</p>
              </div>
              <div className="bad-cosmetic">
                <p className="sub-title">
                  맞지 않는
                  <br />
                  화장품
                </p>
                <p className="count">{badCosmeticsCount}개</p>
              </div>
            </div>
            {/* <Link to={`mypage/${userId}`}> */}
            <Link to={`mypage/`}>
              <button className="cosmetic-register-btn">화장품 등록하기</button>
            </Link>
          </div>
        </div>
      </div>

      {/* 추천 화장품 박스 */}
      <div className="recommend-cosmetic">
        <p className="title">
          <span className="nickname">먀먀</span>님의 추천 화장품
        </p>
        <div className="recommend-list">
          {recommendedCosmetics.map((cosmetic) => (
            <RecommendItem key={cosmetic.cosmeticId} cosmetic={cosmetic} />
          ))}
        </div>
      </div>

      {/* 네브바 */}
      <NavBar />
    </div>
  );
}

export default Home;
