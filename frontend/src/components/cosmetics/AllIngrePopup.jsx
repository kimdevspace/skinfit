import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./AllIngrePopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// 전성분 정보 가져오는 api 요청
const fetchAllIngredient = async (cosmeticId) => {
  const response = await axios.get(`/api/v1/${cosmeticId}/all-ingredients`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

function AllIngrePopup({ cosmeticId, closePopup }) {
  // 전성분 정보 가져오기
  const { data: allIngredient, error, isLoading, isError } = useQuery({
    queryKey: ['allIngredient', cosmeticId],
    queryFn : () => fetchAllIngredient(cosmeticId),
    enabled: !!cosmeticId // cosmeticId가 있을 때만 실행
  })

  // api에서 받아온 전성분 데이터
  // const { ingredient } = allIngredient.data

  // 로딩, 에러 확인
  if (isLoading) {
    return console.log("로딩중", isLoading);
  }
  if (isError) {
    return console.log("에러", isLoading);
  }
  
  
  return (
    <div className="overlay">
      <div className="all-ingredient-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <p className="popup-title">전성분 보기</p>
        <div className="all-ingredient">
          <div className="grade-box low">
            <p className="grade-title">안전 등급</p>
            <div className="ingredient">
              <p className="ingredient-name">정제수</p>
              <p className="ewg-score">1</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">히알루론산</p>
              <p className="ewg-score">1-2</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">나이아신마이드</p>
              <p className="ewg-score">2</p>
            </div>
          </div>
          <div className="grade-box moderate">
            <p className="grade-title">보통 등급</p>
            <div className="ingredient">
              <p className="ingredient-name">정제수</p>
              <p className="ewg-score">1</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">히알루론산</p>
              <p className="ewg-score">1-2</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">나이아신마이드</p>
              <p className="ewg-score">2</p>
            </div>
          </div>
          <div className="grade-box high">
            <p className="grade-title">위험 등급</p>
            <div className="ingredient">
              <p className="ingredient-name">정제수</p>
              <p className="ewg-score">1</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">히알루론산</p>
              <p className="ewg-score">1-2</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">나이아신마이드</p>
              <p className="ewg-score">2</p>
            </div>
          </div>
          <div className="grade-box unclassified">
            <p className="grade-title">미분류 등급</p>
            <div className="ingredient">
              <p className="ingredient-name">정제수</p>
              <p className="ewg-score">1</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">히알루론산</p>
              <p className="ewg-score">1-2</p>
            </div>
            <div className="ingredient">
              <p className="ingredient-name">나이아신마이드</p>
              <p className="ewg-score">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllIngrePopup;
