import React from "react";
import "./Button.scss";

function Button({ text, color, type = "button", onClick }) {
  return (
    <button className={`button ${color}`} type={type} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
