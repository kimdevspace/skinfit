import { useState, useRef } from "react";
import "./ReviewRegister.scss";
import Header from "../../components/common/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function ReviewRegister() {
  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    rating: "",
    reviewContent: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 피부 적합 여부
  const ratingOption = [
    { value: "GOOD", label: "잘 맞았어요" },
    { value: "BAD", label: "안 맞았어요" },
    { value: "UNKNOWN", label: "모르겠어요" },
  ];

  // 리뷰 사진 등록
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // 최대 3개 파일
    setReviewData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  return (
    <div className="review-register">
      <Header title="리뷰 등록" />

      <form action="">
        {/* 상품명 */}
        <div className="input-wrapper cosmetic-name">
          <p className="input-title">상품명</p>
          <p>리뷰 쓸 상품명</p>
        </div>

        {/* 피부 적합 여부 */}
        <div className="input-wrapper review-rating">
          <legend className="input-title">피부에 잘 맞았나요?</legend>
          <div className="radio-box">
            {ratingOption.map((option) => (
              <label key={option.value} htmlFor={option.value}>
                <input
                  type="radio"
                  value={option.value}
                  name="rating"
                  id={option.value}
                  checked={reviewData.rating === option.value}
                  onChange={handleInputChange}
                />
                <span className="radio-label">{option.label}</span>
              </label>
            ))}
          </div>
          <p className="error-msg">피부 적합 여부를 선택해주세요</p>
        </div>

        {/* 리뷰 작성 */}
        <div className="input-wrapper review-content">
          <label className="input-title" htmlFor="review-content">
            리뷰를 작성해주세요
          </label>
          <textarea
            name="reviewContent"
            value={reviewData.reviewContent}
            id="review-content"
            placeholder="리뷰를 작성해주세요"
            onChange={handleInputChange}
          ></textarea>
          <p className="error-msg">리뷰가 작성되지 않았습니다</p>
        </div>

        {/* 리뷰 사진 등록 */}
        <div className="input-wrapper review-images">
          <label className="input-title" htmlFor="images">
            사진을 등록해주세요(선택)
          </label>
          <div className="custom-file-input">
            <div
              className="custom-file-input-btn"
              onClick={handleFileButtonClick}
            >
              <p>등록할 사진을 선택해주세요</p>
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            </div>
          </div>
          <input
            type="file"
            id="images"
            accept=".jpg, .png"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </div>
      </form>
    </div>
  );
}

export default ReviewRegister;
