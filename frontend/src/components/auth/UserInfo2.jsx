import React, { useMemo } from "react";
import "./UserInfo2.scss";
import { useSearchPopupStore } from "../../stores/SearchPopup";

/**
 * @param {string} label - 상단에 보여줄 라벨 텍스트 (예: "나에게 잘 맞는 화장품 등록(필수)")
 * @param {string} placeholder - 텍스트영역 placeholder
 * @param {function} onSearchClick - 검색 팝업창을 여는 함수
 * @param {string} category - 현재 카테고리 (suitableCosmetics 등)
 */
function UserInfo2({ label, placeholder, onSearchClick, category }) {
  const { items, getSymptomNames } = useSearchPopupStore();

  // 스토어에 있는 items
  const categoryItems = items[category];

  // 텍스트 포맷팅
  const displayText = useMemo(() => {
    if (!categoryItems?.length) return "";

    return categoryItems
      .map((item) => {
        const symptoms = item.symptoms
          ? ` (증상: ${getSymptomNames(item.symptoms)})`
          : "";

        if ("cosmeticId" in item) {
          return `${item.brandName} ${item.cosmeticName}${symptoms}`;
        }
        return `${item.ingredientName}${symptoms}`;
      })
      .join("\n");
  }, [categoryItems, getSymptomNames]);

  return (
    <div className="UserInfo2-block">
      <div className="info-header">
        <label>{label}</label>
        <button
          type="button"
          className="search-btn"
          onClick={() => onSearchClick(category)}
        >
          찾기
        </button>
      </div>

      {/* 텍스트영역 */}
      <textarea
        className="info-textarea"
        placeholder={placeholder}
        value={displayText}
        readOnly
      />
    </div>
  );
}

export default UserInfo2;
