import React, { useState } from "react";
import "./UserInfo2.scss";

/**
 * @param {string} label - 상단에 보여줄 라벨 텍스트 (예: "나에게 잘 맞는 화장품 등록(필수)")
 * @param {string} placeholder - 텍스트영역 placeholder
 * @param {function} onSearchClick - "찾기" 버튼을 눌렀을 때 실행할 함수
 * @param {array} listData - 아래에 표시할 리스트 항목들
 */
function UserInfo2({ label, placeholder, onSearchClick, listData = [] }) {
  const displayText = listData.join("\n");

  return (
    <div className="UserInfo2-block">
      <div className="info-header">
        <label>{label}</label>
        <button type="button" className="search-btn" onClick={onSearchClick}>
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
