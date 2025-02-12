import React from "react";
import './ToggleButton.scss'
import { useState } from 'react'

//props 전달
export default function ToggleButton({ text1, text2, handler}) {
  
  // 버튼 탐지지
  const [activeText, setActiveText] = useState(text1)
  const handleActive = (text) => {
    setActiveText(text)
    handler(text) // 부모에게 전달
  }

  return (
    
    <div className="toggle-container">
      <button
        className={`toggle-btn ${activeText === text1 ? 'active' : ''}`}
        onClick={() => handleActive(text1)}
      >
        {text1}
      </button>
      <button
        className={`toggle-btn ${activeText === text2 ? 'active' : ''}`}
        onClick={() => handleActive(text2)}
      >
        {text2}
      </button>

    </div>
  );
}
