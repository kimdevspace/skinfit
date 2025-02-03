import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";

/**
 * @param {string} title - 헤더에 표시할 텍스트
 * @param {Function} onBack - 뒤로가기 버튼 클릭 시 실행될 함수
 */
function Header({ title, onBack }) {
  return (
    <header className="header">
      <button className="back-button" onClick={onBack}>
        <FontAwesomeIcon icon={faChevronLeft} size="2x" />
      </button>
      <h1 className="page-title">{title}</h1>
    </header>
  );
}

export default Header;
