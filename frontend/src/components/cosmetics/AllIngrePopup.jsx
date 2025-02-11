import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./AllIngrePopup.scss";
import IngredientList from "./IngredientList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// 전성분 정보 가져오는 api 요청
const fetchAllIngredient = async (cosmeticId) => {
  const response = await axios.get(`/api/v1/${cosmeticId}/all-ingredients`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

function AllIngrePopup({ cosmeticId, closePopup }) {
  // 전성분 정보 가져오기
  const {
    data: allIngredient,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allIngredient", cosmeticId],
    queryFn: () => fetchAllIngredient(cosmeticId),
    enabled: !!cosmeticId, // cosmeticId가 있을 때만 실행
  });

  // 로딩, 에러 확인
  if (isLoading) {
    return console.log("로딩중", isLoading);
  }
  if (isError) {
    return console.log("에러", isLoading);
  }

  // api에서 받아온 전성분 데이터
  // const { low, moderate, high, others } = allIngredient.data

  //#region 전성분 더미 데이터
  const { low, moderate, high, others } = {
    low: [
      {
        ingredientName: "히알루론산",
        ewgScoreMin: 1,
        ewgScoreMax: 2,
      },
    ],
    moderate: [
      {
        ingredientName: "나이아신아마이드",
        ewgScoreMin: 3,
        ewgScoreMax: 6,
      },
    ],
    high: [
      {
        ingredientName: "페녹시에탄올",
        ewgScoreMin: 7,
        ewgScoreMax: 9,
      },
    ],
    others: [],
  };
  //#endregion


  // 등급별 데이터 매핑
  const grades = {
    low: { title: "안전 등급", ingredients: low, className: "low" },
    moderate: {
      title: "보통 등급",
      ingredients: moderate,
      className: "moderate",
    },
    high: { title: "위험 등급", ingredients: high, className: "high" },
    others: {
      title: "미분류 등급",
      ingredients: others,
      className: "unclassified",
    },
  };

  // 등급 클릭 시 토글
  const [openGrades, setOpenGrades] = useState({
    low: true, // 처음에는 안전 등급만 열려 있도록 설정
    moderate: false,
    high: false,
    others: false,
  });

  const toggleGrade = (grade) => {
    setOpenGrades((prev) => ({
      ...prev,
      [grade]: !prev[grade], // 클릭한 등급만 상태 변경
    }));
  };

  return (
    <div className="overlay">
      <div className="all-ingredient-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <p className="popup-title">전성분 보기</p>

        {/* 등급  */}
        <div className="all-ingredient">
          {Object.keys(grades).map((key) => (
            <div key={key} className={`grade-box ${grades[key].className}`}>
              <p className="grade-title" onClick={() => toggleGrade(key)}>
                {grades[key].title}
              </p>
              {/* 상태에 따라 성분 리스트 표시 */}
              {openGrades[key] && (
                <IngredientList
                  className={grades[key].className}
                  ingredients={grades[key].ingredients}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllIngrePopup;
