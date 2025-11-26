import React from "react";
import "../styles/input.css";

export default function InputField({ label, type="text", value, onChange }) {
  return (
    <div className="input-box">
      {label && <label>{label}</label>}
      <input 
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
