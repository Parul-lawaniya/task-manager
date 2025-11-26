import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faEye } from "@fortawesome/free-solid-svg-icons";

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isDone = task.status === "done";

  return (
    <motion.div
      className={`task-row ${isDone ? "task-row--done" : ""}`}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <button
        type="button"
        className={`task-check ${isDone ? "task-check--active" : ""}`}
        onClick={() => onToggleStatus(task.id)}
        aria-label={isDone ? "Mark as pending" : "Mark as done"}
      />

      <div className="task-row__body">
        <p className="task-row__title">{task.title}</p>
        <p className="task-row__description">{task.description}</p>
      </div>

    

      <div className="task-row__actions">
        <Link
          to={`/task/${task.id}`}
          className="icon-btn"
          aria-label="View task details"
        >
          <FontAwesomeIcon icon={faEye} style={{ color: "#1f6235" }} />
        </Link>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onEdit(task.id)}
          aria-label="Edit task"
        >
          <FontAwesomeIcon icon={faPen} style={{ color: "green" }} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />
        </button>
      </div>
    </motion.div>
  );
}

