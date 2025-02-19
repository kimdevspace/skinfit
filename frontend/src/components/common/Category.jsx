import React from "react";
import "./Category.scss";


/**
 * @param {string[]} skinTypes - 현재 선택된 피부타입 목록
 * @param {Function} onToggleType - 피부타입 클릭 시 선택/해제하는 함수
 */
function Category({ skinTypes, onToggleType }) {
  // 피부타입 매핑 (문자열 -> ID)
  const typeMap = {
    "지성": 1,
    "건성": 2,
    "중성": 3,
    "복합성": 4,
    "민감성": 5
  };

  const allTypes = ["지성", "건성", "중성", "복합성", "민감성"];

  return (
    <div className="form-group skintype-group">
      <label>피부타입 (중복선택 가능)</label>
      <div className="skintype-options">
        {allTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`skin-btn ${skinTypes.includes(typeMap[type]) ? "selected" : ""}`}
            onClick={() => onToggleType(typeMap[type])}
          >
            {type}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Category;
