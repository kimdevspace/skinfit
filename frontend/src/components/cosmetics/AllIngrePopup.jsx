import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import "./AllIngrePopup.scss";
import IngredientList from "./IngredientList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// 전성분 정보 가져오는 API 요청
const fetchAllIngredient = async (cosmeticId) => {
  const response = await axios.get(`${cosmeticId}/details`);
  return response.data;
};

function AllIngrePopup({ cosmeticId, closePopup }) {
  // 모든 Hook은 항상 호출되어야 합니다.
  const queryResult = useQuery({
    queryKey: ["allIngredient", cosmeticId],
    queryFn: () => fetchAllIngredient(cosmeticId),
    enabled: !!cosmeticId,
  });
  
  // useState는 항상 호출
  const [openGrades, setOpenGrades] = useState({
    low: true,      // 처음에는 안전 등급만 열려 있도록 설정
    moderate: false,
    high: false,
    others: false,
  });
  
  const toggleGrade = (grade) => {
    setOpenGrades((prev) => ({
      ...prev,
      [grade]: !prev[grade],
    }));
  };

  // queryResult에서 값들을 추출 (항상 호출된 Hook 결과)
  const { data: allIngredient, isLoading, isError } = queryResult;

  return (
    <div className="overlay">
      <div className="all-ingredient-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <p className="popup-title">전성분 보기</p>

        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error occurred while loading ingredients.</div>
        ) : (
          // allIngredient 데이터가 있을 때
          <div className="all-ingredient">
            {(() => {
              // 데이터가 존재할 때만 구조 분해
              const { low, moderate, high, others } = allIngredient;
              const grades = {
                low: { title: "안전 등급", ingredients: low, className: "low" },
                moderate: { title: "보통 등급", ingredients: moderate, className: "moderate" },
                high: { title: "위험 등급", ingredients: high, className: "high" },
                others: { title: "미분류 등급", ingredients: others, className: "unclassified" },
              };
              return Object.keys(grades).map((key) => (
                <div key={key} className={`grade-box ${grades[key].className}`}>
                  <p className="grade-title" onClick={() => toggleGrade(key)}>
                    {grades[key].title}
                  </p>
                  {openGrades[key] && (
                    <IngredientList
                      className={grades[key].className}
                      ingredients={grades[key].ingredients}
                    />
                  )}
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllIngrePopup;
