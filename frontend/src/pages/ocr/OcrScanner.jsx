import "./OcrScanner.scss";
import ImageUpload from "../../components/common/ImageUpload";
import Button from "../../components/common/Button";
import { useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function OcrScanner() {

  //카테고리 타입입
  const allTypes = [
    "로션",
    "스킨",
    "에센스",
    "크림",
    "클렌징",
    "바디",
    "선케어",
  ];

  // ocr 사진 데이터
  const [ocrData, setOcrData] = useState({
    brandName: "",
    cosmeticName: "",
    images: [],
    capacity: "",
  });

  // 데이터 POST 요청
  const uploadOcr = async (ocr) => {
    const formData = new FormData();
    formData.append("brandName", ocr.brandName);
    formData.append("cosmeticName", ocr.cosmeticName);
    formData.append("capacity", ocr.capacity);
    ocr.images.forEach((file) => formData.append("images", file));
    console.log("ocr 사진 upload 한다");

    return axios.post(`products/ocr`, formData, {
      headers: {
        // Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const mutation = useMutation({
    mutationFn: uploadOcr,
    onSuccess: () => {
      alert("사진이 등록되었어요.");
      setOcrData({ rating: "", reviewContent: "", images: [] }); //?
    },
    onError: () => {
      alert("사진 등록에 실패했어요.");
    },
  });

  const handleInputChange = (e) => {
  
  };

  const brandNameErrorRef = useRef(null);
  const cosmeticNameErrorRef = useRef(null);
  const capacityErrorRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ocrData.brandName) {
      brandNameErrorRef.current.classList.add("error");
      return;
    } else {
      brandNameErrorRef.current.classList.remove("error");
    }

    if (!ocrData.cosmeticName) {
      cosmeticNameErrorRef.current.classList.add("error");
      return;
    } else {
      cosmeticNameErrorRef.current.classList.remove("error");
    }

    if (!ocrData.capacity) {
      capacityErrorRef.current.classList.add("error");
      return;
    } else {
      capacityErrorRef.current.classList.remove("error");
    }

    mutation.mutate(ocrData);
  };

  return (
    <div className="ocr-register-form">
      <div className="input-wrapper">
        <p className="input-title">상품명</p>
        <input id="name" type="text" placeholder="상품명을 입력해주세요" />
      </div>
      <div className="input-wrapper">
        <p className="input-title">브랜드명</p>
        <input id="name" type="text" placeholder="브랜드명을 입력해주세요" />
      </div>

      <div className="category-group">
        <label>카테고리</label>
        <div className="skintype-options">
          {allTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`skin-btn ${
                allTypes.includes(type) ? "selected" : ""
              }`}
              onClick={() => handleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="input-wrapper">
        <p className="input-title">상품용량(mL)</p>
        <input id="name" type="text" placeholder="상품용량을 입력해주세요" />
      </div>

      {/* 리뷰 사진 등록 */}
      <ImageUpload
        images={ocrData.images}
        setImages={setOcrData}
        maxImages={1}
      />

      <Button text="등록하기" color="pink" type="submit" />
    </div>
  );
}
