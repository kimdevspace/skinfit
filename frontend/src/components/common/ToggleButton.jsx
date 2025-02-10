import React from "react";
import './ToggleButton.scss'
import { useState } from 'react'

//props 전달
export default function ToggleButton({ btn1, btn2 }) {
  

  return (
    
    <div className="toggle-container">
      <button className={`toggle-btn ${? 'active' : ''}`} onClick={handleToggle}>{ btn1 }</button>
      <button className={`toggle-btn ${! ? 'active' : ''}`} onClick={handleToggle}>{ btn2 }</button>
    </div>
  );
}
