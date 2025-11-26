import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{title || "Confirm Action"}</h3>
        <p className="confirm-message">{message || "Are you sure you want to proceed?"}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn--confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

