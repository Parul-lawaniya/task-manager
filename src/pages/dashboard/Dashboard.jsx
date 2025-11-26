import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import TaskCard from "../../components/tasks/TaskCard";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import TaskForm from "../../components/tasks/TaskForm";
import TaskFilterTabs from "../../components/tasks/TaskFilterTabs";
import SearchBar from "../../components/search/SearchBar";
import SortDropdown from "../../components/sort/SortDropdown";
import Pagination from "../../components/pagination/Pagination";
import ConfirmDialog from "../../components/confirm/ConfirmDialog";
import { getToken, removeToken } from "../../utils/Auth";
import { getStoredTasks, saveTasks } from "../../utils/taskStorage";
import { filters } from "../../utils/constants";

export default function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);

    const TASKS_PER_PAGE = 10;

    useEffect(() => {
        if (!getToken()) navigate("/login", { replace: true });
    }, [navigate]);

    // Load tasks ONCE
    useEffect(() => {
        const saved = getStoredTasks();
        setTasks(saved);
        setInitialized(true);
    }, []);

    // Save tasks on update
    useEffect(() => {
        if (!initialized) return;
        saveTasks(tasks);
    }, [tasks, initialized]);

    // Reset to page 1 when filters/search/sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery, sortOrder]);

    // Filter and sort logic
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // Filter by status
        if (activeFilter === "pending") {
            result = result.filter((t) => t.status === "pending");
        } else if (activeFilter === "done") {
            result = result.filter((t) => t.status === "done");
        }

        // Filter by search query (title)
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter((t) =>
                t.title.toLowerCase().includes(query)
            );
        }

        // Sort by date (latest or oldest)
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [tasks, activeFilter, searchQuery, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // Selected task for edit
    const selectedTask = useMemo(
        () => tasks.find((t) => t.id === editingTaskId) ?? null,
        [tasks, editingTaskId]
    );

    const openCreateModal = () => {
        setEditingTaskId(null);
        setModalOpen(true);
    };

    const openEditModal = (taskId) => {
        setEditingTaskId(taskId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTaskId(null);
    };

    const handleTaskSubmit = (formValues) => {
        if (editingTaskId) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === editingTaskId ? { ...task, ...formValues } : task
                )
            );
            toast.success("Task updated");
        } else {
            const newTask = {
                id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
                title: formValues.title,
                description: formValues.description,
                status: "pending",
                createdAt: new Date().toISOString(),
                updatedAt: null,
            };
            setTasks((prev) => [newTask, ...prev]);
            toast.success("Task added");
        }

        closeModal();
        return true;
    };

    const handleDeleteTask = (taskId) => {
        setTaskIdToDelete(taskId);
    };

    const confirmDelete = () => {
        if (taskIdToDelete) {
            setTasks((prev) => prev.filter((t) => t.id !== taskIdToDelete));
            toast.info("Task deleted");
            setTaskIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setTaskIdToDelete(null);
    };

    const taskToDelete = useMemo(
        () => tasks.find((t) => t.id === taskIdToDelete) ?? null,
        [tasks, taskIdToDelete]
    );

    const toastFired = useRef(false);

    const handleToggleStatus = (taskId) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id === taskId) {
                    const newStatus = task.status === "done" ? "pending" : "done";
                    if (!toastFired.current) {
                        if (newStatus === "done") toast.success("Task marked as completed");
                        else toast.info("Task moved to pending");
                        toastFired.current = true;
                    }
                    return { ...task, status: newStatus };
                }
                return task;
            })
        );


        toastFired.current = false;
    };

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <section className="hero-card">
                <div className="hero-text">
                    <p className="eyebrow">Todo App</p>
                    <h1>Stay on top of today</h1>
                    <p className="subhead">
                        Keep your tasks tidy, update their status, and focus on what needs attention right now.
                    </p>
                </div>
                <Button text="Logout" type="primary" onClick={handleLogout} />
            </section>

            <section className="tasks-panel">
                <div className="tasks-panel__header">
                    <div>
                        <h2>Tasks</h2>
                        <p className="muted">
                            {tasks.length === 0
                                ? "No tasks yet"
                                : `${tasks.length} total · ${tasks.filter((t) => t.status === "done").length
                                } done`}
                        </p>
                    </div>

                    <Button text="Add Task" type="primary" onClick={openCreateModal} />
                </div>
                {/* filter tabs */}
                <TaskFilterTabs
                    options={filters}
                    value={activeFilter}
                    onChange={setActiveFilter}
                />
                {/* searchbar , search by my tittle*/}
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search tasks by title"
                />

                {/* sort dropdown */}
                <SortDropdown
                    value={sortOrder}
                    onChange={setSortOrder}
                />

                {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <h3>No tasks yet</h3>
                        <p>Use the Add Task button to create your first todo.</p>
                    </div>
                ) : (
                    <>
                        <div className="task-list">
                            {paginatedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleStatus={handleToggleStatus}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </div>

                        {filteredTasks.length > TASKS_PER_PAGE && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </section>


            {/* Modal using here */}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editingTaskId ? "Edit task" : "Add task"}
            >
                <TaskForm
                    initialValues={selectedTask ?? { title: "", description: "" }}
                    mode={editingTaskId ? "edit" : "create"}
                    onSubmit={handleTaskSubmit}
                    onCancel={closeModal}
                />
            </Modal>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={taskIdToDelete !== null}
                title="Delete Task"
                message={
                    taskToDelete
                        ? `Are you sure you want to delete "${taskToDelete.title}"?.`
                        : "Are you sure you want to delete this task?"
                }
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
