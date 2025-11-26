// KEY used in localStorage
const TASKS_KEY = "myTasks";

// Load tasks from localStorage
export const getStoredTasks = () => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load tasks:", err);
    return [];
  }
};

// Save tasks array to localStorage
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error("Failed to save tasks:", err);
    return false;
  }
};

// Add a single new task
export const addTask = (task) => {
  const tasks = getStoredTasks();
  const updated = [task, ...tasks];
  saveTasks(updated);
  return updated;
};

// Remove a task by ID
export const removeTask = (taskId) => {
  const tasks = getStoredTasks();
  const updated = tasks.filter((t) => t.id !== taskId);
  saveTasks(updated);
  return updated;
};

// Update a task by ID
export const updateTask = (taskId, updatedValues) => {
  const tasks = getStoredTasks();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, ...updatedValues } : t
  );
  saveTasks(updated);
  return updated;
};
