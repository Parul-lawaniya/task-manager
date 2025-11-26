import React from "react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search tasks by title..." }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

