import './ReviewComplaintPopup.scss'

import React from "react";
import "./ReviewComplaintPopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function ReviewComplaintPopup({ closePopup }) {
  return (
    <div className="overlay">
      <div className="review-complaint-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 리뷰 신고 폼 */}
        <form>
          <label htmlFor="reason" className="popup-title">
            리뷰 신고하기
          </label>
          <textarea
            name="reason"
            id="reason"
            placeholder="신고 이유를 작성해주세요"
          ></textarea>
          <p className="error-msg">신고 이유가 작성되지 않았습니다</p>
          <button className="submit-btn">신고하기</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewComplaintPopup;
