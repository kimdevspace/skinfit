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
// import ReviewItem from "../../components/review/ReviewItem";

// 화장품 정보 요청 함수
const fetchCosmeticDetails = async (cosmeticId) => {
  const response = await axios.get(`cosmetics/${cosmeticId}`);
  return response.data.cosmetic;
};

// 리뷰 요청 함수
const fetchReviews = async ({ cosmeticId, sort, page, isMyReview }) => {
  const response = await axios.get(`cosmetics/${cosmeticId}/reviews`, {
    params: {
      sort,
      page,
      limit: 10,
      MyReview: isMyReview ? "true" : "false",
    },
  });
  return response.data;
};

function CosmeticDetail() {
  const { cosmeticId } = useParams(); // 화장품 id 파라미터

  // 화장품 정보 요청
  const { data: cosmeticData } = useQuery({
    queryKey: ["cosmetic", cosmeticId],
    queryFn: () => fetchCosmeticDetails(cosmeticId),
  });

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
  } = useQuery({
    queryKey: ["reviews", cosmeticId, sortOrder, page, isOn],
    queryFn: () =>
      fetchReviews({
        cosmeticId,
        sort: sortOrder,
        page,
        limit: 10,
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
          {/* {reviews.map((review, idx) => (
            <ReviewItem key={idx} review={review} />
          ))} */}
        </div>
      </div>

      {/* 네브바 */}
      <NavBar />
    </div>
  );
}

export default CosmeticDetail;