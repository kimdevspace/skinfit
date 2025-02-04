import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./ReviewRegister.scss";
import Header from "../../components/common/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/common/Button";

function ReviewRegister(cosmeticId) {
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
  const [imagePreviews, setImagePreviews] = useState([]); // 미리보기용 URL

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    if (!e.target.files.length) return;

    const newFiles = Array.from(e.target.files);
    const allFiles = [...reviewData.images, ...newFiles].slice(0, 3);

    setReviewData((prev) => ({
      ...prev,
      images: allFiles,
    }));

    // 사진 미리보기를 위한 URL 생성
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) =>
      [...prevPreviews, ...newPreviewUrls].slice(0, 3)
    );

    e.target.value = "";
  };

  // 업로드한 사진 삭제
  const handleDeleteImage = (index) => {
    setImagePreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      URL.revokeObjectURL(updatedPreviews[index]); // 사진 URL 해제
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });

    setReviewData((prevData) => {
      const updatedImages = [...prevData.images];
      updatedImages.splice(index, 1);
      return {
        ...prevData,
        images: updatedImages,
      };
    });
  };

  // 리뷰 데이터 POST 요청
  const uploadReview = async (review)=> {
    const formData = new FormData()
    formData.append("reviewCount", review.reviewContent)
    formData.append("rating", review.rating)
    review.images.forEach((file) => formData.append("images", file))
    console.log("upload 한다")

    return axios.post(`/api/v1/products/${cosmeticId}/reviews`, formData, {
      headers: {
        // Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      }
    })
  }

  const mutation = useMutation({
    mutationFn: uploadReview,
    onSuccess: () => {
      alert("리뷰가 등록되었습니다.")
      setReviewData({ rating: "", reviewContent: "", images: []})
      setImagePreviews([])
    },
    onError: () => {
      alert("리뷰 등록에 실패했습니다.")
    }
  })

  const ratingErrorRef = useRef(null)
  const contentErrorRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // rating 유효성 검사
    if (!reviewData.rating) {
      ratingErrorRef.current.classList.add("error")
      return
    } else {
      ratingErrorRef.current.classList.remove("error")
    }

    // content 유효성 검사
    if (!reviewData.reviewContent) {
      contentErrorRef.current.classList.add("error");
      return
    } else {
      contentErrorRef.current.classList.remove("error");
    }

    mutation.mutate(reviewData)
  }


  return (
    <div className="review-register">
      <Header title="리뷰 등록" />

      <form onSubmit={handleSubmit}>
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
          <p className="error-msg" ref={ratingErrorRef}>피부 적합 여부를 선택해주세요</p>
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
          <p className="error-msg" ref={contentErrorRef}>리뷰가 작성되지 않았습니다</p>
        </div>

        {/* 리뷰 사진 등록 */}
        <div className="input-wrapper review-images">
          <label className="input-title" htmlFor="images">
            사진을 등록해주세요(선택)
          </label>
          <div className="custom-file-input">
            <div className="preview-container">
              {imagePreviews.map((url, index) => (
                <div key={index} className="preview-box">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="preview-img"
                  />
                  <button className="delete-btn" type="button">
                    <FontAwesomeIcon
                      icon={faXmark}           
                      onClick={() => handleDeleteImage(index)}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div
              className="custom-file-input-btn"
              onClick={handleFileButtonClick}
            >
              {reviewData.images.length ? null : (
                <p>등록할 사진을 선택해주세요</p>
              )}
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            </div>
          </div>
          <input
            type="file"
            id="images"
            accept=".jpg, .png"
            // accept="image/*" // 모바일 웹에서 업로드 오류시 실행해보기
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </div>

        <Button text="등록하기" color="pink" type="submit" />
      </form>
    </div>
  );
}

export default ReviewRegister;
