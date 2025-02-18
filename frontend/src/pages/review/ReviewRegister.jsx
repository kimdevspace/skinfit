import { useState, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "../../api/axiosInstance.js"
import "./ReviewRegister.scss"
import Header from "../../components/common/Header"
import Button from "../../components/common/Button"
import ImageUpload from "../../components/common/ImageUpload"

function ReviewRegister(cosmeticId) {
  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    rating: null,
    reviewContent: "",
    images: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReviewData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value, // rating이면 숫자로 변환
    }))
  }

  //헤더 뒤로가기 설정
  // 폼 데이터 변경 감지 함수
  const hasUnsavedChanges = () => {
    // 폼 데이터 변경 여부 확인 로직
    return reviewData.rating !== null || 
           reviewData.reviewContent !== "" || 
           reviewData.images.length > 0
  }

  // 피부 적합 여부
  const ratingOption = [
    { value: 0, label: "잘 맞았어요" },
    { value: 1, label: "안 맞았어요" },
    { value: 2, label: "모르겠어요" },
  ]

  // 리뷰 데이터 POST 요청
  const uploadReview = async (review) => {
    const formData = new FormData()
    formData.append("reviewContent", review.reviewContent)
    formData.append("rating", review.rating)
    review.images.forEach((file) => formData.append("images", file))
    console.log("upload 한다")

    return axios.post(`cosmetics/${cosmeticId}/reviews`, formData)
  }

  const mutation = useMutation({
    mutationFn: uploadReview,
    onSuccess: () => {
      alert("리뷰가 등록되었습니다.")
      setReviewData({ rating: "", reviewContent: "", images: [] })
    },
    onError: () => {
      alert("리뷰 등록에 실패했습니다.")
    },
  })

  const ratingErrorRef = useRef(null)
  const contentErrorRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // rating 유효성 검사
    if (reviewData.rating === null) {
      ratingErrorRef.current.classList.add("error")
      return
    } else {
      ratingErrorRef.current.classList.remove("error")
    }

    // content 유효성 검사
    if (!reviewData.reviewContent === "") {
      contentErrorRef.current.classList.add("error")
      return
    } else {
      contentErrorRef.current.classList.remove("error")
    }

    mutation.mutate(reviewData)
  }

  return (
    <div className="review-register">
      <Header title="리뷰 등록" confirmBack={hasUnsavedChanges} />

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
                <input type="radio" value={option.value} name="rating" id={option.value} checked={reviewData.rating === option.value} onChange={handleInputChange} />
                <span className="radio-label">{option.label}</span>
              </label>
            ))}
          </div>
          <p className="error-msg" ref={ratingErrorRef}>
            피부 적합 여부를 선택해주세요
          </p>
        </div>

        {/* 리뷰 작성 */}
        <div className="input-wrapper review-content">
          <label className="input-title" htmlFor="review-content">
            리뷰를 작성해주세요
          </label>
          <textarea name="reviewContent" value={reviewData.reviewContent} id="review-content" placeholder="리뷰를 작성해주세요" onChange={handleInputChange}></textarea>
          <p className="error-msg" ref={contentErrorRef}>
            리뷰가 작성되지 않았습니다
          </p>
        </div>

        {/* 리뷰 사진 등록 */}
        <ImageUpload images={reviewData.images} setImages={setReviewData} maxImages={3} dataType="review" />

        <Button text="등록하기" color="pink" type="submit" />
      </form>
    </div>
  )
}

export default ReviewRegister
