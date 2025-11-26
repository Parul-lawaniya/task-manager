import React from "react";
import "./SortDropdown.css";

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="sort-dropdown-container">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="latest">Latest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}

