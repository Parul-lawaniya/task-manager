import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./TaskDetails.css";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/confirm/ConfirmDialog";
import { getToken } from "../../utils/Auth";
import { getStoredTasks, saveTasks } from "../../utils/taskStorage";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login", { replace: true });
      return;
    }

    const tasks = getStoredTasks();
    setAllTasks(tasks);
    const found = tasks.find((t) => t.id === id);

    if (!found) {
      toast.error("Task not found");
      navigate("/dashboard", { replace: true });
      return;
    }

    setTask(found);
  }, [id, navigate]);

  const updateTasks = (updatedTasks) => {
    setAllTasks(updatedTasks);
    saveTasks(updatedTasks);
    const updated = updatedTasks.find((t) => t.id === id);
    if (updated) {
      setTask(updated);
    }
  };

  const handleToggleStatus = () => {
    const updated = allTasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: t.status === "done" ? "pending" : "done",
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    updateTasks(updated);
    toast.success(
      task.status === "done"
        ? "Task moved to pending"
        : "Task marked as completed"
    );
  };

  const handleDelete = () => {
    const remaining = allTasks.filter((t) => t.id !== id);
    updateTasks(remaining);
    toast.info("Task deleted");
    navigate("/dashboard", { replace: true });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Not set";
    try {
      return new Date(isoString).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (!task) {
    return (
      <div className="task-details-page">
        <div className="loading-state">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <div className="task-details-container">
        <div className="task-details-header">
          <Link to="/dashboard" className="back-link">
            ← Back
          </Link>
          <h1>{task.title}</h1>
        </div>

        <div className="task-details-content">
          <div className="task-section">
            <h3>Description</h3>
            <p className="task-description">{task.description || "No description provided"}</p>
          </div>

          <div className="task-section">
            <h3>Status</h3>
            <span className={`status-badge status-${task.status}`}>
              {task.status === "done" ? "Done" : "Pending"}
            </span>
          </div>

          <div className="task-section">
            <h3>Created At</h3>
            <p className="task-date">{formatDate(task.createdAt)}</p>
          </div>

          {task.updatedAt && (
            <div className="task-section">
              <h3>Last Updated</h3>
              <p className="task-date">{formatDate(task.updatedAt)}</p>
            </div>
          )}
        </div>

        <div className="task-details-actions">
          <Button
            text={task.status === "done" ? "Mark as Pending" : "Mark as Done"}
            type="primary"
            onClick={handleToggleStatus}
          />
          <Button
            text="Delete Task"
            type="danger"
            onClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

