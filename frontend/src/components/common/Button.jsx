import React from "react";
import "./Button.scss";

function Button({ text, color, type = "button", onClick, onSubmit }) {
  return (
    <button
      className={`button ${color}`}
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
    >
      {text}
    </button>
  );
}

export default Button;
