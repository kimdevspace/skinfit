import { useState, useMemo } from "react";
import "./SearchPopupItem.scss";
import { useSearchPopupStore } from "../../stores/SearchPopup";
import SymptomPopup from "./SymptomPopup";

// item : 현재 해당하는 화장품 또는 성분 데이터
// type : 화장품인지 성분인지
// category : 잘 맞는/안 맞는, 화장품/성분 4가지 경우 중 1가지의 경우
function SearchPopupItem({ item, type, category }) {
  
  // 스토어에서 필요 데이터, 함수 가져오기
  const { items, addItem, removeItem, getIdKey } = useSearchPopupStore();

  // 현재 카테고리의 아이템 목록과 선택 여부를 메모이제이션
  const isSelected = useMemo(() => {
    // 현재 카테고리의 아이템 목록
    const currentItems = items[category] || [];

    // 현재 아이템의 id키 가져오기
    const idKey = getIdKey(category);

    // 현재 아이템이 선택되었는지 확인
    const isSelected = currentItems.some(
      (selected) => selected[idKey] === item[idKey]
    );

    return { currentItems, isSelected };
  }, [items, category, item, getIdKey]);

  // 증상 선택 팝업 상태
  const [isSymptomPopupOpen, setIsSymptomPopupOpen] = useState(false);

  // 아이템 추가
  const handleAdd = async () => {
    if (category.includes("unsuitable")) {
      // 안 맞는 경우 증상 선택 팝업 열기
      setIsSymptomPopupOpen(true);
    } else {
      // 잘 맞는 경우 바로 추가
      addItem(category, item);
    }
  };

  // 아이템 제거
  const handleRemove = async () => {
    removeItem(category, item);
  };

  // 증상 선택 완료 처리
  const handleSymptomSubmit = async (symptoms) => {
    const itemWithSymptoms = { ...item, symptoms };
    addItem(category, itemWithSymptoms);
    setIsSymptomPopupOpen(false);
  };

  return (
    <div className="search-popup-item">
      {type === "cosmetics" ? (
        // 화장품인 경우hh
        <>
          <img src="" alt="" />
          <div className="text-box">
            <p className="brand-name">{item.brandName}</p>
            <p className="main-text">{item.cosmeticName}</p>
          </div>
        </>
      ) : (
        // 성분인 경우
        <div className="text-box">
          <p className="main-text">{item.ingredientName}</p>
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
          item={item}
          onClose={() => setIsSymptomPopupOpen(false)}
          onSubmit={handleSymptomSubmit}
        />
      )}
    </div>
  );
}

export default SearchPopupItem;
