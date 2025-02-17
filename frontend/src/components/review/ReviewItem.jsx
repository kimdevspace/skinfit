import "./ReviewItem.scss";
import thumbsUpEmoji from "../../assets/images/thumsUp.png";
import ReviewComplaintPopup from "./ReviewComplaintPopup";
import { useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReviewItem({ review, reviewType }) {
  //신고팝업창 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  //파라미터
  const { cosmeticId, reviewId } = useParams(); // 화장품, 리뷰 id 파라미터

  //리뷰 좋아요, 취소 핸들러
  const handleLike = () => {
    // 일반리뷰일 때 속 남의 리뷰라면면
    if (reviewType === 'generalReviews' && !review.userNickname?.) {
      likeMutation.mutate({ 
        cosmeticId, 
        reviewId 
      });
    } else {
      // 다른 경우 처리
    }
  };

  // 리뷰 좋아요
  const fetchReviewsLike = async ({ cosmeticId, reviewId }) => {
    const response = await axios.post(
      `cosmetics/${cosmeticId}/reviews/${reviewId}/add-like`,
      {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
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
      console.log('좋아요 추가완료')
    }
  });

  // 리뷰 좋아요 취소
  const fetchReviewsDelete = async ({ cosmeticId, reviewId }) => {
    const response = await axios.delete(
      `cosmetics/${cosmeticId}/reviews/${reviewId}/delete-like`,
      {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      fetchReviewsDelete({
        cosmeticId,
        reviewId,
      }),
    onSuccess: () => {
      console.log('리뷰 삭제되었습니다')
    }
  });

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

      {review.map((review, index) => (
        <div key={index} className="review-content">
          {review.content}
          {review.images &&
            review.images.map((img, imgIndex) => (
              <img key={imgIndex} className="review-photo" src="" alt="user-review-photo" />
            ))}
          <div className="btn-set">
            <button className="liked-btn active" onClick={() => handleLike(review.reviewId)}>
              <img src={thumbsUpEmoji} alt="liked-btn" className="emoji" />
              {review.likes}개
            </button>
            <button className="report-btn" onClick={handlePopup}>
              신고| {dayjs(review.createdAt).format("YYYY-MM-DD")}
            </button>
            {isPopupOpen && <ReviewComplaintPopup onClose={handlePopup} />}
          </div>
        </div>
      ))}
    </>
  );
}
