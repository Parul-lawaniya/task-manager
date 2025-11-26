import React from "react";

export default function TaskFilterTabs({ options, value, onChange }) {
  return (
    <div className="filter-tabs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`filter-tab ${value === option.value ? "is-active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
