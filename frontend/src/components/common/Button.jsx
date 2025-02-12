import React from "react";
import "./Button.scss";

function Button({ text, color, type = "button", onSubmit }) {
  return (
    <button className={`button ${color}`} type={type} onClick={onSubmit}>
      {text}
    </button>
  );
}

export default Button;
