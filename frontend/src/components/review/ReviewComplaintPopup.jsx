import "./ReviewComplaintPopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axiosInstance";

function ReviewComplaintPopup({ onClose, cosmeticId, reviewId }) {
  //신고 데이터
  const [reportData, setReportData] = useState('');

  // 신고 post 요청
  const reportReview = async (reasonData) => {
    return axios.post(
      `cosmetics/${cosmeticId}/reviews/${reviewId}/report`,
      { reason: reasonData }
    );
  };  

  //react query
  const mutation = useMutation({
    mutationFn: reportReview,
    onSuccess: () => {
      console.log("신고접수 완료");
      onClose();
    },
    onError: (error) => {
      console.error("신고 접수 에러", error);
    },
  });

 //내용 작성 여부 
  const contentErrorRef = useRef(null);

  //신고 접수
  const handleSubmit = (e) => {
    e.preventDefault();

    // 이유 작성 여부 확인
    if (!reportData.trim()) {
      contentErrorRef.current.classList.add('error');
      return;
    } else {
      contentErrorRef.current.classList.remove('error');
    }
    
    //mutate 메서드 (비동기처리)
    mutation.mutate({ reason: reportData });
  }

  return (
    <div className="overlay">
      <div className="review-complaint-popup">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 리뷰 신고 폼 */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="reason" className="popup-title">
            리뷰 신고하기
          </label>
          <textarea
            name="reason"
            id="reason"
            placeholder="신고 이유를 작성해주세요"
            value={reportData}
            // input 태그의 포커스를 벗어났을때 (즉, 입력이 끝났을때) 발생하는 이벤트
            onChange={(e) => setReportData(e.target.value)}
          ></textarea>
          <p className="error-msg" ref={contentErrorRef}>신고 이유가 작성되지 않았습니다</p>
          <button className="submit-btn">
            신고하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewComplaintPopup;
