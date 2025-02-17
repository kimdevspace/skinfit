import "./ReviewItem.scss";
import thumbsUpEmoji from "../../assets/images/thumsUp.png";
import ReviewComplaintPopup from "./ReviewComplaintPopup";
import { useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import  useAuthStore  from "../../stores/Auth";

// reviewItem :
// cosmeticId,. reviewId 필요
// 상세페이지면 isLiked 필드로 처리
// 마이페이지면 그냥 db에서 삭제 => 보이는 거에서 제외

export default function ReviewItem({ review, reviewType }) {
  //  인증 토큰
  const { isAuthenticated, accessToken } = useAuthStore();

  //신고팝업창 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  //파라미터
  const { cosmeticId, reviewId } = useParams(); // 화장품, 리뷰 id 파라미터

  // JWT 토큰 디코딩하여 userId 얻기
  const getUserId = () => {
    if (!accessToken) return null;
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return payload.userId; // JWT 페이로드에서 userId 추출
  };

  // 리뷰 작성자 파악
  const currentUserId = getUserId();
  const isOwnReview = review?.userId === currentUserId; // undefined === false 처리

  // 리뷰 좋아요
  const fetchReviewsLike = async ({ cosmeticId, reviewId }) => {
    const response = await axios.post(
      `cosmetics/${cosmeticId}/reviews/${reviewId}/add-like`,
      {
        params: {
          cosmeticId,
          reviewId,
        },
      }
    );
    return response.data;
  };

  // 리뷰 좋아요 요청
  const likeMutation = useMutation({
    mutationFn: () =>
      fetchReviewsLike({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log("좋아요 추가완료");
    },
  });

  // 리뷰 좋아요 취소 함수수
  const fetchReviewsUnLike = async ({ cosmeticId, reviewId }) => {
    const response = await axios.delete(
      `cosmetics/${cosmeticId}/reviews/${reviewId}/delete-like`,
      {
        params: {
          cosmeticId,
          reviewId,
        },
      }
    );
    return response.data;
  };

  // 리뷰 좋아요 취소
  const deleteMutation = useMutation({
    mutationFn: () =>
      fetchReviewsUnLike({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log("리뷰 좋아요 취소되었습니다");
    },
  });

  //리뷰 좋아요, 취소 핸들러
  const handleLike = () => {
    // 일반리뷰(상세페이지 전체리뷰) 목록일 때 // 남의 리뷰인 경우
    if (reviewType === "generalReviews" && !isOwnReview) {
      // 좋아요가 안 되어있으면
      if (!review.isLiked) {
        likeMutation.mutate({
          cosmeticId,
          reviewId,
        });
        // 좋아요가 되어있으면
      } else {
        deleteMutation.mutate({
          cosmeticId,
          reviewId,
        });
      }
    }
    // 마이페이지의 내가 좋아요한 리뷰 목록이면 좋아요 취소 & 목록에서 안보이게 되야함
    else if (reviewType === "likedReviews") {
      deleteMutation.mutate({
        cosmeticId,
        reviewId,
      });
    }
  };

  // 리뷰 좋아요 취소 함수수
  const fetchReviewsDelete = async ({ cosmeticId, reviewId }) => {
    const response = await axios.delete(
      `cosmetics/${cosmeticId}/reviews/${reviewId}`,
      {
        params: {
          cosmeticId,
          reviewId,
        },
      }
    );
    return response.data;
  };

  // 리뷰 좋아요 취소
  const deleteReviewMutation = useMutation({
    mutationFn: () =>
      fetchReviewsDelete({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log("리뷰 삭제되었습니다");
    },
  });

  // 리뷰 삭제 핸들러
  const handleDeleteReview = () => {
    deleteReviewMutation.mutate({
      cosmeticId,
      reviewId,
    });
  };

  //리뷰 점수(잘맞아요 등)
  const scoreMap = {
    0: { text: "GOOD", class: "good" },
    1: { text: "UNKNOWN", class: "unknown" },
    2: { text: "BAD", class: "bad" },
  };

  // 신고 팝업창창
  const handlePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <div key={review.reviewId} className="review-box">
        {reviewType !== "generalReviews" ? (
          <div className="name-brand">
            <span className="cosmetic-brand"> {review.cosmetic.brand} </span>
            <span className="cosmetic-name">{review.cosmetic.name} </span>
          </div>
        ) : null}

        {reviewType !== "myReviews" ? (
          <div className="user-info-section">
            <span className="user-name">{review.userNickname}님</span>
            <div className="age-skintype">
              <span className="user-age">{review.userAgeGroup}대 |</span>
              {review?.userSkinTypes?.map((skintype, index) => (
                <span key={index} className="user-skintype">
                  {" "}
                  {skintype}{" "}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <span className={`user-answer ${scoreMap[review.score].class}`}>
          {scoreMap[review.score].text}
        </span>
      </div>
      <hr />

      {/* review는 객체이므로 map을 사용할 수 없습니다. 수정이 필요합니다 */}
      <div className="review-content">
        {review.content}
        {review.images?.map((img, imgIndex) => (
          <img
            key={imgIndex}
            className="review-photo"
            src=""
            alt="user-review-photo"
          />
        ))}

        <div className="btn-set">
          <button
            className={`liked-btn ${review.isLiked ? "active" : ""}`}
            onClick={handleLike}
            disabled={isOwnReview || reviewType === "myReviews"}
          >
            <img src={thumbsUpEmoji} alt="liked-btn" className="emoji" />
            {review.likes}개
          </button>

          {reviewType !== "myReviews" ? (
            <>
              <button className="report-btn" onClick={handlePopup}>
                신고| {dayjs(review.createdAt).format("YYYY-MM-DD")}
              </button>
              {isPopupOpen && <ReviewComplaintPopup onClose={handlePopup} />}
            </>
          ) : (
            <button className="report-btn" onClick={handleDeleteReview}>
              삭제| {dayjs(review.createdAt).format("YYYY-MM-DD")}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
