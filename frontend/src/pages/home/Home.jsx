import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import "./Home.scss";
import Logo from "../../components/common/Logo";
import RecommendItem from "../../components/home/RecommendItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import NavBar from "../../components/common/NavBar";
import SearchPopup from "../../components/search/SearchPopup.jsx";

function Home() {
  // 메인 페이지(추천 상품, 화장품 정보) 필요한 정보 api 요청
  const fetchMainPageInfo = async () => {
    const response = await axios.get("mainpage", {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const {
    data: mainInfo,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mainPageInfo"],
    queryFn: fetchMainPageInfo,
  });

  // api에서 받아온 정보 데이터
  // const { level, goodCosmeticsCount, badCosmeticsCount, recomCosmetic } = mainInfo.data

  // 로딩, 에러 확인
  if (isLoading) {
    return console.log("로딩중", isLoading);
  }
  if (isError) {
    return console.log("에러", isLoading);
  }
  // #region 더미 데이터
  // api 요청 받을 수 없어서 오류남 -> 더미 데이터 생성
  const level = "level 1";
  const goodCosmeticsCount = "2";
  const badCosmeticsCount = "3";
  const recomCosmetic = [
    {
      cosmeticId: 101,
      cosmeticName: "수분 크림",
      brandName: "브랜드 A",
      imageUrl: "https://example.com/images/product1.jpg",
      badge: {
        mismatchedIngredientsCount: 0,
        mismatchedIngredients: [],
      },
    },
    {
      cosmeticId: 102,
      cosmeticName: "보습 로션",
      brandName: "브랜드 B",
      imageUrl: "https://example.com/images/product2.jpg",
      badge: {
        mismatchedIngredientsCount: 0,
        mismatchedIngredients: [],
      },
    },
  ];
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
          <button>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
        </div>

        <div className="analysis-accuracy-info-box">
          {/* 분석 정확도 */}
          <div className="accuracy-level-box">
            <div className="heart"></div>
            <p className="level">{level}</p>
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
          {recomCosmetic.map((cosmetic) => (
            <RecommendItem key={cosmetic.cosmeticId} cosmetic={cosmetic} />
          ))}
        </div>
      </div>

      {/* 네브바 */}
      <NavBar />

      <SearchPopup
        type="cosmetic"
        suitability="unsuitable"
        category="unsuitableCosmetics"
      />
    </div>
  );
}

export default Home;
