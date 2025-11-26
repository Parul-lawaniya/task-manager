import React from "react";
import "./ThemeToggle.css";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle__icon">{isDark ? "🌙" : "☀️"}</span>
      <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

