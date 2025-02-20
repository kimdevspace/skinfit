import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import "./Header.scss"

/**
 * @param {string} title - 헤더에 표시할 텍스트
 * @param {Function} onBack - 각 페이지에서 뒤로가기 버튼 클릭 시 실행될 함수 전달
 * @param {boolean} showBackButton - 뒤로가기 버튼 UI 띄우거나 않거나
 * @param {boolean} confirmBack - 작성 중인 내용이 있는지(뒤로 가기전 체크)
 * @param {string} confirmMessage - form 등 작성중인 내용이 있을 때 뒤로 가기전 alert 메시지
 */
function Header({ title, onBack, showBackButton = true, confirmBack = false, confirmMessage = "잠깐! 작성 중인 내용이 있어요. 뒤로가기를 희망하나요?" }) {
  const handleBack = () => {
    if (confirmBack) {
      // 확인이 필요한 경우
      if (window.confirm(confirmMessage)) {
        onBack() // 사용자가 '확인' 클릭
      } // 사용자가 '취소' 클릭 → 아무 동작 안 함
    } else {
      // 확인이 필요 없는 경우
      onBack() // 바로 뒤로가기 실행
    }
  }

  return (
    <header className="header">
      {showBackButton && (
        <button className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}

      <h1 className="page-title">{title}</h1>
    </header>
  )
}

export default Header
