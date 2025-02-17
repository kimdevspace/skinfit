// src/pages/admin/CosmeticForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./CosmeticForm.scss";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVUeXBlIjoiQURNSU4iLCJpYXQiOjE3Mzk3Njc1NDcsImV4cCI6MTczOTc2OTM0N30.jgn_yQlQrwRWN2RWW24SsUtgzBj2IAT44TlP1Nm8qKo";

function CosmeticForm() {
  const { cosmeticId } = useParams();
  console.log("cosmeticId:", cosmeticId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 화장품 상세 정보를 가져옵니다.
  const { data, isLoading, error } = useQuery({
    queryKey: ["cosmeticDetail", cosmeticId],
    queryFn: () =>
      axios.get(`admin/cosmetics/${cosmeticId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      ).then((res) => res.data),
  });

  // 폼 상태: 화장품 이름, 브랜드, 용량, 그리고 성분 ID 배열
  const [formData, setFormData] = useState({
    cosmeticName: "",
    cosmeticBrand: "",
    cosmeticVolume: "",
    ingredientIds: [],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        cosmeticName: data.cosmeticName,
        cosmeticBrand: data.cosmeticBrand,
        cosmeticVolume: data.cosmeticVolume,
        // data.ingredients가 IngredientDetailDto 배열로 가정 (각 객체에 ingredientId 존재)
        ingredientIds: data.ingredients.map((ing) => ing.ingredientId),
      });
    }
  }, [data]);

  // 업데이트 mutation (PUT 요청)
  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axios.put(`/admin/cosmetics/${cosmeticId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmeticDetail", cosmeticId] });
      navigate("/admin/cosmetics");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
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
                type="text"
                value={formData.cosmeticName}
                onChange={(e) =>
                  setFormData({ ...formData, cosmeticName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>화장품 브랜드</label>
              <input
                type="text"
                value={formData.cosmeticBrand}
                onChange={(e) =>
                  setFormData({ ...formData, cosmeticBrand: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>화장품 용량</label>
              <input
                type="text"
                value={formData.cosmeticVolume}
                onChange={(e) =>
                  setFormData({ ...formData, cosmeticVolume: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>화장품 성분 (콤마로 구분하여 성분 ID 입력)</label>
              <input
                type="text"
                value={formData.ingredientIds.join(",")}
                onChange={(e) => {
                  const value = e.target.value;
                  const ids = value
                    .split(",")
                    .map((s) => parseInt(s.trim()))
                    .filter((id) => !isNaN(id));
                  setFormData({ ...formData, ingredientIds: ids });
                }}
              />
            </div>
            <div className="form-group">
              <label>화장품 이미지</label>
              <input type="file" />
              {/* 파일 업로드 처리는 별도 로직 필요 */}
            </div>
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
