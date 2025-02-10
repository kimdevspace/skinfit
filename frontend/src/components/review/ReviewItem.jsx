import "./ReviewItem.scss"
import thumbsUpEmoji from "../../assets/images/thumsUp.png"
import ReviewComplaintPopup from "./ReviewComplaintPopup"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function ReviewItem({ reviews }) {
  
  //리뷰 점수(잘맞아요 등)
  const scoreMap = {
    0: { text: 'GOOD', class: 'good'},
    1: { text: 'UNKNOWN', class: 'unknown'},
    2: { text: 'BAD', class: 'bad'},

  };

  //신고팝업창 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handlePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <>
     {Array.isArray(reviews) &&
        reviews.map((review) => {
          <div key={review.reviewId} className="review-box">
            <p className="cosmetic-name">{review.cosmetic.name} </p>
            <div className="user-info-section">
              <span className="user-name">{review.userNickname}님</span>
              <div className="age-skintype">
                <span className="user-age">{review.userAgeGroup}대 |</span>
                {review.userSkinTypes.map((skintype) => {
                  ;<span className="user-skintype"> {skintype} </span>
                })}
              </div>
              <span className={`user-answer ${scoreMap[review.score].class}`} >{scoreMap[review.score].text}</span>
            </div>
            <hr />
            <div className="review-content">
              {review.content}
              {review.images &&
                review.images.map((img) => {
                  <img className="review-photo" src="" alt="user-review-photo" />
                })}
              <div className="btn-set">
                <button className="liked-btn">
                  <img src={thumbsUpEmoji} alt="liked-btn" className="emoji" />
                  {review.likeCount}개
                </button>
                <button className="report-btn" onClick={handlePopup}>
                  신고| {review.createdAt}
                </button>
                {isPopupOpen && <ReviewComplaintPopup onClose={handlePopup} />}
              </div>
            </div>
          </div>
        })}
    </>
  )
}
