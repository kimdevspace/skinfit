import "./OcrScanner.scss";
import ImageUpload from "../../components/common/ImageUpload";
import Button from "../../components/common/Button";
import { useRef, useState } from "react";
import axios from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import Header from "../../components/common/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCompletePopupStore } from '../../stores/CompletePopup.js'

export default function OcrScanner() {
  const navigate = useNavigate();

  // CompletePopup 스토어에서 꺼내오기
  const showPopup = useCompletePopupStore(state => state.showPopup);

  // ocr 사진 데이터
  const [ocrData, setOcrData] = useState({
    cosmeticBrand: "",
    cosmeticName: "",
    categoryId: "",
    images: [],
    cosmeticVolume: "",
  });

  // ocr 이미지 필수제출 관리
  const [imageError, setImageError] = useState(false);

  // 헤더 뒤로가기 설정
  const hasUnsavedChanges = () => {
    // 폼 데이터 변경 여부 확인 로직
    // 실제로 데이터가 변경되었는지 확인
    return (
      ocrData.cosmeticBrand !== "" ||
      ocrData.cosmeticName !== "" ||
      ocrData.categoryId !== "" ||
      ocrData.images.length > 0 ||
      ocrData.cosmeticVolume !== ""
    );
  };

  // 뒤로가기 핸들러 추가
  const handleBack = () => {
    // 변경사항이 있으면 확인
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        "작성 중인 내용이 있습니다. 뒤로 가시겠습니까?"
      );
      if (confirmed) {
        navigate(-1); // 뒤로가기
      }
      // 확인 안 하면 그대로 유지
    } else {
      navigate(-1); // 변경사항 없으면 바로 뒤로가기
    }
  };

  // //카테고리 타입
  // const allTypes = [
  //   "로션",
  //   "스킨",
  //   "에센스",
  //   "크림",
  //   "클렌징",
  //   "바디",
  //   "선케어",
  // ];

  // 카테고리 매핑 (한글 → 숫자)
  const categoryMap = {
    로션: 1,
    스킨: 2,
    에센스: 3,
    크림: 4,
    클렌징: 5,
    바디: 6,
    선케어: 7,
  };

  const allTypes = Object.keys(categoryMap);

  // 카테고리 선택 핸들러
  const handleType = (type) => {
    const newCategoryId =
      ocrData.categoryId === categoryMap[type] ? "" : categoryMap[type];

    console.log("Selected categoryId:", newCategoryId);

    setOcrData((prevData) => ({
      ...prevData,
      categoryId: newCategoryId,
    }));
  };
  // 입력 필드 핸들러
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setOcrData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const uploadOcr = async (ocr) => {
    const formData = new FormData();

    // Create the data object that matches the backend DTO
    const dataObject = {
      cosmeticBrand: ocr.cosmeticBrand,
      cosmeticName: ocr.cosmeticName,
      cosmeticVolume: ocr.cosmeticVolume,
      categoryId: ocr.categoryId,
    };

    // Add the JSON data as a part named "data"
    formData.append(
      "data",
      new Blob([JSON.stringify(dataObject)], {
        type: "application/json",
      })
    );

    // Add the image file with the correct part name "ingredientImage"
    if (ocr.images && ocr.images.length > 0) {
      formData.append("ingredientImage", ocr.images[0]);
    }

    console.log("Sending data object:", dataObject);

    return axios.post(`/ocr`, formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    });
  };

  const mutation = useMutation({
    mutationFn: uploadOcr,
    onSuccess: () => {
      showPopup('등록');
      setOcrData({
        cosmeticBrand: "",
        cosmeticName: "",
        categoryId: "",
        images: [],
        cosmeticVolume: "",
      }); //초기화
      navigate("/");
    },
    onError: (error) => {
      console.error("Upload error:", error.response?.data || error);
      alert(error.response?.data?.message || "사진 등록에 실패했어요.");
    },
  });

  console.log('isLoading?', mutation.isPending)

  //미입력 에러메시지 관리리
  const brandNameErrorRef = useRef(null);
  const cosmeticNameErrorRef = useRef(null);
  const capacityErrorRef = useRef(null);
  const categoriesErrorRef = useRef(null);
  // const imagesErrorRef = useRef(null)

  // 폼 제출출
  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const fields = [
      { name: "cosmeticBrand", ref: brandNameErrorRef },
      { name: "cosmeticName", ref: cosmeticNameErrorRef },
      { name: "cosmeticVolume", ref: capacityErrorRef },
      { name: "categoryId", ref: categoriesErrorRef },
      // { name: "images", ref: imagesErrorRef },
    ];

    fields.forEach((field) => {
      const value = ocrData[field.name];
      if (!value) {
        field.ref.current.classList.add("error");
        hasError = true;
      } else {
        field.ref.current.classList.remove("error");
      }
    });

    if (ocrData.images?.length === 0) {
      setImageError(true);
      hasError = true;
    } else {
      setImageError(false);
    }

    if (!hasError) {
      mutation.mutate({
        ...ocrData,
        ingredientImage: ocrData.images, // 백엔드가 원하는 필드명으로 맞춰서 전달
      });
    }
  };
  return (
    <>
      {mutation.isPending ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="info-txt">화장품을 등록하고 있어요!</p>
        </div>
      ) : (
        <>
          <Header title="성분 스캐너" onBack={handleBack} />
          <div className="ocr-register-form">
            <div className="input-wrapper">
              <p className="input-title">상품명</p>
              <input
                id="cosmeticName"
                type="text"
                value={ocrData.cosmeticName}
                onChange={handleInputChange}
                placeholder="상품명을 입력해주세요"
              />
              <p className="error-msg" ref={cosmeticNameErrorRef}>
                상품명 입력은 필수예요
              </p>
            </div>
            <div className="input-wrapper">
              <p className="input-title">브랜드명</p>
              <input
                id="cosmeticBrand"
                type="text"
                value={ocrData.cosmeticBrand}
                onChange={handleInputChange}
                placeholder="브랜드명을 입력해주세요"
              />
              <p className="error-msg" ref={brandNameErrorRef}>
                브랜드명 입력은 필수예요
              </p>
            </div>

            <div className="category-group">
              <label>카테고리</label>
              <div className="skintype-options">
                {allTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`skin-btn ${
                      ocrData.categoryId === categoryMap[type] ? "selected" : ""
                    }`}
                    onClick={() => handleType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="error-msg" ref={categoriesErrorRef}>
                카테고리 선택은 필수예요
              </p>
            </div>
            <div className="input-wrapper">
              <p className="input-title">상품용량(mL)</p>
              <input
                id="cosmeticVolume"
                type="text"
                value={ocrData.cosmeticVolume}
                onChange={handleInputChange}
                placeholder="상품용량을 입력해주세요"
              />
              <p className="error-msg" ref={capacityErrorRef}>
                상품용량 입력은 필수예요
              </p>
            </div>

            {/* 전성분 사진 등록 */}
            <ImageUpload
              images={ocrData.images}
              setImages={setOcrData}
              maxImages={1}
              dataType="ocr"
              onError={setImageError}
              error={imageError}
            />

            <Button
              text="등록하기"
              color="pink"
              type="button"
              onClick={handleSubmit}
            />
          </div>
        </>
      )}
    </>
  );
}
