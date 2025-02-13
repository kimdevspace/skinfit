import React, { useState } from "react";
import "./SearchPopupItem.scss";
import { useUserInfoStore } from "../../stores/userInfo";
import SymptomPopup from "./SymptomPopup";

// item : 현재 해당하는 화장품 또는 성분 데이터
// type : 화장품인지 성분인지
// category : 잘 맞는/안 맞는, 화장품/성분 4가지 경우 중 1가지의 경우
function SearchPopupItem({ item, type, category }) {
  // 스토어에서 필요 데이터 가져오기
  const {
    suitableCosmetics,
    suitableIngredients,
    unsuitableCosmetics,
    unsuitableIngredients,
    addItem,
    removeItem,
  } = useUserInfoStore();

  // 현재 카테고리의 아이템 목록 선택
  const currentItems = {
    suitableCosmetics,
    suitableIngredients,
    unsuitableCosmetics,
    unsuitableIngredients,
  }[category];

  // 현재 아이템(화장품/성분)이 선택되었는지 확인
  const isSelected = currentItems.some(
    (selectedItem) => selectedItem.id === item.id // 아이디값 이렇게 쓰는지 확인해야함
  );

  // 아이템 안 증상 담기 위한 변수
  const [currentItem, setCurrentItem] = useState(null);

  // 증상 팝업 상태 관리
  const [isSymptomPopupOpen, setIsSymptomPopupOpen] = useState(false);

  // 아이템 추가 핸들러
  const handleAdd = () => {
    if (["unsuitableCosmetics", "unsuitableIngredients"].includes(category)) {
      // 안 맞는 화장품, 성분 팝업
      setCurrentItem(item) // 현재 아이템 설정
      setIsSymptomPopupOpen(true);
    } else {
      addItem(category, item);
    }
  };

  // 아이템 제거 핸들러
  const handleRemove = () => removeItem(category, item);

  // 증상 팝업 닫기 및 아이템 업데이트 핸들러
  const handleSymptomSubmit = (updateItem) => {
    console.log(updateItem)
    addItem(category, currentItem);
    setIsSymptomPopupOpen(false);
  }

  return (
    <div className="search-popup-item">
      {type === "cosmetic" ? (
        // 화장품인 경우
        <>
          <img src="" alt="" />
          <div className="text-box">
            <p className="brand-name">달바</p>
            <p className="main-text">미스트 화이트 머스크 트러플 세럼</p>
          </div>
        </>
      ) : (
        // 성분인 경우
        <div className="text-box">
          <p className="main-text">히알루론산</p>
        </div>
      )}

      {/* 추가/삭제 버튼 */}
      <div className="btn-box">
        <button
          className={`btn add-btn ${!isSelected ? "active" : ""}`}
          onClick={handleAdd}
        >
          추가
        </button>
        <button
          className={`btn remove-btn ${isSelected ? "active" : ""}`}
          onClick={handleRemove}
        >
          삭제
        </button>
      </div>

      {/* 증상 팝업(안 맞는 화장품, 성분 팝업일 때) */}
      {isSymptomPopupOpen && (
        <SymptomPopup
          type={type}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          onClose={() => setIsSymptomPopupOpen(false)}
          onSubmit={handleSymptomSubmit}
        />
      )}
    </div>
  );
}

export default SearchPopupItem;
