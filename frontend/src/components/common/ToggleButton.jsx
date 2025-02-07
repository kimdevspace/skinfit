import React from "react";
import './ToggleButton.scss'


export default function ToggleButton({ btn1, btn2 }) {
  return (
    <div className="toggle-container">
      <button className="toggle-btn active">{ btn1 }</button>
      <button className="toggle-btn">{ btn2 }</button>
    </div>
  );
}
