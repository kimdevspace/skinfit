import "./ReviewItem.scss";
import thumbsUpEmoji from "../../assets/images/thumsUp.png";
import ReviewComplaintPopup from "./ReviewComplaintPopup";
import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import useAuthStore from "../../stores/Auth";

// reviewItem :
// cosmeticId,. reviewId 필요
// 상세페이지면 isLiked 필드로 처리
// 마이페이지면 그냥 db에서 삭제 => 보이는 거에서 제외

//리뷰 점수(잘맞아요 등)
const scoreMap = {
  0: { text: "GOOD", class: "good" },
  1: { text: "UNKNOWN", class: "unknown" },
  2: { text: "BAD", class: "bad" },
};

// 리뷰 좋아요 api 요청
const fetchReviewsLike = async ({ cosmeticId, reviewId }) => {
  const response = await axios.post(
    `cosmetics/${cosmeticId}/reviews/${reviewId}/add-like`
  );
  return response.data;
};

// 리뷰 좋아요 취소 api 요청
const fetchReviewsUnLike = async ({ cosmeticId, reviewId }) => {
  const response = await axios.delete(
    `cosmetics/${cosmeticId}/reviews/${reviewId}/delete-like`
  );
  return response.data;
};

// 리뷰 삭제 api 요청
const fetchReviewsDelete = async ({ cosmeticId, reviewId }) => {
  const response = await axios.delete(
    `cosmetics/${cosmeticId}/reviews/${reviewId}`
  );
  return response.data;
};

export default function ReviewItem({ review, reviewType }) {
  const queryClient = useQueryClient();
  const params = useParams(); //

  //  인증 토큰
  const { accessToken } = useAuthStore();

  //신고팝업창 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 화장품, 리뷰 Id 가져오기
  let cosmeticId;
  if (reviewType === 'generalReviews') {
    cosmeticId = params.cosmeticId; // 파라미터에서 가져옴
  } else {
    cosmeticId = review.cosmetic.cosmeticId; // review 객체에서 가져옴
  }
  const reviewId = review.reviewId;

  // JWT 토큰 디코딩하여 userId 얻기
  const getUserId = useCallback(() => {
    if (!accessToken) return null;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.userId; // JWT 페이로드에서 userId 추출
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      // 토큰 관련 에러 처리 (예: 로그아웃 처리나 토큰 갱신)
      return null;
    }
  }, [accessToken]); // 엑세스 토큰이 변경될 때만 함수 재생성

  // 리뷰 작성자 파악
  const currentUserId = getUserId();
  const isOwnReview = review?.userId === currentUserId; // undefined === false 처리

  // 리뷰 좋아요
  const likeMutation = useMutation({
    mutationFn: () =>
      fetchReviewsLike({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log("좋아요 추가완료");
      // 리뷰 데이터 캐시를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries(["reviews", cosmeticId]);
    },
  });

  // 리뷰 좋아요 취소
  const deleteMutation = useMutation({
    mutationFn: () =>
      fetchReviewsUnLike({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log("리뷰 좋아요 취소되었습니다");
      queryClient.invalidateQueries(["reviews", cosmeticId]); // 캐시 무효화
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

  // 리뷰 삭제
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

  // 신고 팝업창창
  const handlePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="review-box">
      {reviewType !== "generalReviews" ? (
        <div className="name-brand-box">
          <span className="name-brand">
            {review.cosmetic.brand} {review.cosmetic.name}
          </span>
          {reviewType === "myReviews" ? (
            <span className={`user-answer ${scoreMap[review.score].class}`}>
              {scoreMap[review.score].text}
            </span>
          ) : null}
        </div>
      ) : null}

      {reviewType !== "myReviews" ? (
        <div className="user-info-section">
          <span className="user-name">{review.userNickname}님</span>
          <div className="age-skintype">{review.userAgeGroup} | {review.userSkinType}
            
          </div>
          <span className={`user-answer ${scoreMap[review.score].class}`}>
            {scoreMap[review.score].text}
          </span>
        </div>
      ) : null}

      <hr />

      {/* review는 객체이므로 map을 사용할 수 없습니다. 수정이 필요합니다 */}
      <div className="review-content">
        {reviewType === 'generalReviews' ? review.reviewContent : review.content}
        {review.images?.map((img, imgIndex) => (
          <img
            key={imgIndex}
            className="review-photo"
            src={img}
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
                신고 | {dayjs(review.createdAt).format("YYYY-MM-DD")}
              </button>
              {isPopupOpen && <ReviewComplaintPopup onClose={handlePopup} cosmeticId={cosmeticId} reviewId={reviewId} />}
            </>
          ) :  (
            <button className="report-btn" onClick={handleDeleteReview}>
              삭제 | {dayjs(review.createdAt).format("YYYY-MM-DD")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
