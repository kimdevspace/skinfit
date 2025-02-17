import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import "./CosmeticDetail.scss";
import AllIngrePopup from "../../components/cosmetics/AllIngrePopup";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import CosmeticInfo from "../../components/cosmetics/CosmeticInfo";
import NavBar from "../../components/common/NavBar";
import ReviewItem from "../../components/review/ReviewItem";

// 화장품 정보 요청 함수
const fetchCosmeticDetails = async (cosmeticId) => {
  const response = await axios.get(`cosmetics/${cosmeticId}`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.cosmetic;
};

// 리뷰 요청 함수
const fetchReviews = async ({ cosmeticId, sort, page, limit, isMyReview }) => {
  const response = await axios.get(`cosmetics/${cosmeticId}/reviews`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: {
      sort,
      page,
      limit,
      MyReview: isMyReview ? "true" : "false",
    },
  });
  return response.data;
};

function CosmeticDetail() {
  const { cosmeticId } = useParams(); // 화장품 id 파라미터

  // 화장품 정보 요청
  // const { data: cosmeticData, isLoading } = useQuery({
  //   queryKey: ["cosmetic", cosmeticId],
  //   queryFn: () => fetchCosmeticDetails(cosmeticId),
  // });

  // #region 화장품 정보 더미 데이터
  const cosmeticData = {
    cosmeticId: 123,
    cosmeticName: "스킨 토너",
    cosmeticBrand: "브랜드 A",
    category: "스킨케어",
    imageUrl: "https://example.com/images/product123.jpg",
    safetyStatus: "유의",
    ingredients: [
      {
        ingredientName: "히알루론산",
        ewgScoreMax: 2,
        ewgScoreMin: null,
        foundCount: 2, // 내가 써본 화장품에서 발견된 횟수
      },
      {
        ingredientName: "카세늠듐",
        ewgScoreMax: 3,
        ewgScoreMin: 1,
        foundCount: 1, // 내가 써본 화장품에서 발견된 횟수
      },
      {
        ingredientName: "히알루론산",
        ewgScoreMax: 7,
        ewgScoreMin: null,
        foundCount: 0, // 내가 써본 화장품에서 발견된 횟수
      },
    ],
  };
  //#endregion

  // #region 전성분 보기 팝업창 함수
  // 전성분 팝업창 제어
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 전성분 팝업 열기
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // 전성분 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // #endregion

  // 내 피부 맞춤 리뷰 토글
  const [isOn, setIsOn] = useState(true);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  // 리뷰 정렬
  const [sortOrder, setSortOrder] = useState("likes");
  const handleSort = (order) => {
    setSortOrder(order);
  };

  // 리뷰 요청
  const [page, setPage] = useState(1);
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", cosmeticId, sortOrder, page, isOn],
    queryFn: () =>
      fetchReviews({
        cosmeticId,
        sort: sortOrder,
        page,
        limit,
        isMyReview: isOn,
      }),
  });

  return (
    <div className="cosmetic-detail">
      <Header title="상세 정보" />

      {/* 화장품 정보 */}
      <CosmeticInfo cosmeticData={cosmeticData} />

      {/* 전성분 보기 버튼 */}
      <Button text="전성분 보기" color="white" onClick={openPopup} />
      {isPopupOpen && <AllIngrePopup closePopup={closePopup} />}

      {/* 리뷰 */}
      <div className="reviews">
        <p className="title">리뷰</p>

        {/* 내 피부 맞춤 리뷰 */}
        <div className="skin-type-review">
          <div
            className={`toggle-btn ${isOn ? "on" : "off"}`}
            onClick={handleToggle}
          >
            <div className="slider"></div>
          </div>
          <p>내 피부 맞춤 리뷰</p>
        </div>

        {/* 리뷰 컨트롤(정렬, 글 작성) */}
        <div className="review-controls">
          <div className="sort-order-btn">
            <button
              className={`likes ${sortOrder === "likes" ? "active" : ""}`}
              onClick={() => handleSort("likes")}
            >
              좋아요순
            </button>
            <button
              className={`latest ${sortOrder === "latest" ? "active" : ""}`}
              onClick={() => handleSort("latest")}
            >
              최신순
            </button>
          </div>
          <Link to={'review'} className="write-btn">
            작성하기
          </Link>
        </div>

        {/* 리뷰 리스트 */}
        <div className="review-list">
          {reviews?.map((review, idx) => (
            <ReviewItem key={idx} review={review} reviewType='generalReviews' />
          ))}
        </div>
      </div>

      {/* 네브바 */}
      <NavBar />
    </div>
  );
}

export default CosmeticDetail;