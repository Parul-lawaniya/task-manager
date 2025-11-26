import React from "react";
import "./Modal.css";

export default function Modal({ open, title = "Add task", onClose, children }) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
