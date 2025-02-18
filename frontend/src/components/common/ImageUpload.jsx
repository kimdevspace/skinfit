import { useState, useRef, useEffect } from "react"
import "./ImageUpload.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"

function ImageUpload({ images, setImages, maxImages, dataType, onError, error }) {
  const [imagePreviews, setImagePreviews] = useState([]) // 미리보기용 URL 저장 변수
  const fileInputRef = useRef(null) // 미리보기 보여줄 Dom 찾는 변수

  const handleFileButtonClick = () => {
    fileInputRef.current.click()
  }

  // 이미지 업로드 함수
  const handleImageUpload = (e) => {
    if (!e.target.files.length) return

    const newFiles = Array.from(e.target.files)
    const allFiles = [...images, ...newFiles].slice(0, maxImages)

    // 부모 컴포넌트의 상태 업데이트 방식에 따라 다르게 처리
    if (typeof setImages === 'function') {
      if (dataType === 'review' || dataType === 'ocr') {
        // reviewData나 ocrData 객체의 images 필드 업데이트
        setImages(prev => ({
          ...prev,
          images: allFiles
        }));
      } else {
        // 단순 배열 업데이트
        setImages(allFiles);
      }
    }
    // 사진 미리보기를 위한 URL 생성
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviewUrls].slice(0, maxImages))

    e.target.value = ""

    if (error) {
      onError(false) // 이미지가 업로드되면 에러 상태를 false로 설정
    }

  }

  // 업로드한 사진 삭제
  const handleDeleteImage = (index) => {
    setImagePreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews]
      URL.revokeObjectURL(updatedPreviews[index]) // 사진 URL 해제
      updatedPreviews.splice(index, 1)
      return updatedPreviews
    })

    // 부모 컴포넌트의 상태 업데이트 방식에 따라 다르게 처리
    if (typeof setImages === 'function') {
      if (dataType === 'review' || dataType === 'ocr') {
        setImages(prev => {
          const updatedImages = [...prev.images];
          updatedImages.splice(index, 1);
          return {
            ...prev,
            images: updatedImages
          };
        });
      } else {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
      }
    }
  }

  console.log(error)

  return (
    <div className="review-images">
      <label className="input-title" htmlFor="images">
        {dataType === "review" ? "사진을 등록해주세요(선택)" : "전성분표 사진 등록(필수)"}
      </label>
      <div className="custom-file-input">
        <div className="preview-container">
          {imagePreviews.map((url, index) => (
            <div key={index} className="preview-box">
              <img src={url} alt={`preview-${index}`} className="preview-img" />
              <button className="delete-btn" type="button" onClick={() => handleDeleteImage(index)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
        </div>
        <div className="custom-file-input-btn" onClick={handleFileButtonClick}>
          {images?.length === 0 ? <p>등록할 사진을 선택해주세요</p> : null}
          <FontAwesomeIcon icon={faPlus} className="plus-icon" />
        </div>
      </div>
      <input
        type="file"
        id="images"
        accept=".jpg, .png"
        // accept="image/*" // 모바일 웹에서 업로드 오류시 실행해보기
        multiple={maxImages > 1}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <p className={`error-msg ${error ? 'error' : ''}`}> 사진 등록은 필수예요</p>
    </div>
  )
}

export default ImageUpload
