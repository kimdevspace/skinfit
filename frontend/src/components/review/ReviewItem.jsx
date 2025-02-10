import "./ReviewItem.scss";
import thumbsUpEmoji from "../../assets/images/thumsUp.png";
import ReviewComplaintPopup from "./ReviewComplaintPopup";
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

export default function ReviewItem() {

  // 리뷰 데이터 불러오기
const fetchReview = async () => {
  const response = await axios.get("/api/v1/cosmetics/{cosmeticId}/reviews?sort=")
  return response.data
}

const reviewAll = () => {
  return useQuery({
    queryKey: ["reviewAll"],
    queryFn: fetchReview,
    onSuccess: (data) => {
      console.log("리뷰 데이터 조회완료", data)
    },
    onError: (error) => {
      console.error("리뷰 조회 에러", error)
    },
  })
}
  
  //신고팝업창 관리
  const [ isPopupOpen, setIsPopupOpen ] = useState(false);

  const handlePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }

  return (
    <>
      <div className="review-box">
        <p className="cosmetic-name">달바 트러플 뇨끼 100ml </p>

        <div className="user-info-section">
          <span className="user-name">안녕하하님</span>
          <div className="age-skintype">
            <span className="user-age">20대 |</span>
            <span className="user-skintype"> 복합성 민감성</span>
          </div>
          <span className="user-answer good"> GOOD</span>
        </div>
        <hr />
        <div className="review-content">
          이거 바르고 많이 좋아짐 강추강추강추추~
          <img className="review-photo" src="" alt="user-review-photo" />
          <div className="btn-set">
            <button className="liked-btn">
              <img src={thumbsUpEmoji} alt="liked-btn" className="emoji" />
              15개
            </button>
            <button className="report-btn" onClick={handlePopup}>신고| 25.02.11
            </button>
                   { isPopupOpen && <ReviewComplaintPopup onClose={handlePopup}/> }
          </div>
        </div>
      </div>
    </>
  );
}
