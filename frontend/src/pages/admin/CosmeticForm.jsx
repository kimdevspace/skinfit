import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./CosmeticForm.scss";
import ImageUpload from "../../components/common/ImageUpload"; // ImageUpload 컴포넌트 임포트

function CosmeticForm() {
  const { cosmeticId } = useParams();
  console.log("cosmeticId:", cosmeticId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 화장품 상세 정보를 가져옵니다.
  const { data, isLoading, error } = useQuery({
    queryKey: ["cosmeticDetail", cosmeticId],
    queryFn: () =>
      axios
        .get(`admin/cosmetics/${cosmeticId}`)
        .then((res) => res.data),
  });

  // 폼 상태: 화장품 이름, 브랜드, 용량, 그리고 성분 ID 배열
  const [formData, setFormData] = useState({
    cosmeticName: "",
    cosmeticBrand: "",
    cosmeticVolume: "",
    ingredientIds: [],
    images: [], // images는 항상 배열로 초기화
  });

  const [selectedFile, setSelectedFile] = useState(null); // 파일 선택 상태
  const [imageError, setImageError] = useState(false); // 이미지 오류 상태

  // handleInputChange 함수 추가: 입력 값을 상태에 반영
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormData({
        cosmeticName: data.cosmeticName,
        cosmeticBrand: data.cosmeticBrand,
        cosmeticVolume: data.cosmeticVolume,
        ingredientIds: data.ingredients.map((ing) => ing.ingredientName),
        images: [], // 초기화시에도 images는 빈 배열로 설정
      });
    }
  }, [data]);

  // 업데이트 mutation (PUT 요청)
  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axios.put(`/admin/cosmetics/${cosmeticId}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cosmeticDetail", cosmeticId],
      });
      navigate("/admin/cosmetics");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { cosmeticName, cosmeticBrand, cosmeticVolume, ingredientIds, images } = formData;
    const formDataToSubmit = new FormData();

    const dataObject = {
      cosmeticName,
      cosmeticBrand,
      cosmeticVolume,
      ingredientIds, // 성분 ID 목록
    };

    formDataToSubmit.append(
      "data",
      new Blob([JSON.stringify(dataObject)], {
        type: "application/json",
      })
    );

    // 선택된 이미지가 있으면 이를 FormData에 추가
    if (images && images.length > 0) {
      formDataToSubmit.append("cosmeticImage", images[0]);
    }

    mutation.mutate(formDataToSubmit);
  };

  if (isLoading) return <div>Loading cosmetic details...</div>;
  if (error) return <div>Error loading cosmetic details.</div>;

  return (
    <div className="layout">
      <main className="main-content">
        <div className="main-content__header">
          <h1>화장품 등록 검수</h1>
        </div>

        <section className="card">
          <form className="card__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>화장품 이름</label>
              <input
                id="cosmeticName"
                type="text"
                value={formData.cosmeticName}
                onChange={handleInputChange} // handleInputChange 사용
              />
            </div>
            <div className="form-group">
              <label>화장품 브랜드</label>
              <input
                id="cosmeticBrand"
                type="text"
                value={formData.cosmeticBrand}
                onChange={handleInputChange} // handleInputChange 사용
              />
            </div>
            <div className="form-group">
              <label>화장품 용량</label>
              <input
                id="cosmeticVolume"
                type="text"
                value={formData.cosmeticVolume}
                onChange={handleInputChange} // handleInputChange 사용
              />
            </div>
            <div className="form-group">
              <label>화장품 성분</label>
              <textarea
                value={formData.ingredientIds.join(",")}
                onChange={(e) => {
                  const value = e.target.value;
                  const ingredients = value.split(",").map((s) => s.trim());
                  setFormData({ ...formData, ingredientIds: ingredients });
                }}
              />
            </div>

            {/* 이미지 등록 컴포넌트 */}
            <ImageUpload
              images={formData.images} // 이미지는 배열로 전달
              setImages={setFormData} // 이미지 등록 후 상태 업데이트
              maxImages={1} // 최대 이미지 1개로 설정
              dataType="ocr" // 데이터 타입 지정
              onError={setImageError} // 에러 상태 업데이트
              error={imageError} // 에러 메시지 표시 여부
            />

            <div className="card__actions">
              <button type="submit">등록하기</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CosmeticForm;
