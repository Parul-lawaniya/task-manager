import React from "react";
import "../Button/Button.css";

export default function Button({ text, onClick, type = "primary", icon }) {
  return (
    <button className={`btn ${type}`} onClick={onClick}>
      {icon && <span className="btn-icon">{icon}</span>}
      {text}
    </button>
  );
}
