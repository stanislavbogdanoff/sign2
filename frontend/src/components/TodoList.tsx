// BLOCK 1: Importing Dependencies
import React from "react";
import "./TodoList.css";

// BLOCK 2: Defining Interfaces
interface Task {
  _id: string; // Unique ID for the task
  title: string; // Task name
  completed: boolean; // True if done, False if not
  dueDate: string | null;
  priority: "high" | "medium" | "low" | null;
}

interface TodoListProps {
  tasks: Task[];
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  startEditing: (id: string) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// BLOCK 3: Declares the TodoList Component
const TodoList: React.FC<TodoListProps> = ({
  tasks,
  deleteTask,
  updateTask,
  editingTitle,
  setEditingTitle,
  editingTaskId,
  setEditingTaskId,
  startEditing,
  handleEditChange,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && date !== "";
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  // BLOCK 4: Rendering the Task List and handling task actions
  return (
    <div className="todo-container">
      <div className="todo-stats">
        <div className="stat-item total">
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item active">
          <span className="stat-value">{activeTasks}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-value">{completedTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task._id} className={`todo-item priority-${task.priority || "low"}`}>
            <div className="todo-content">
              <div className="todo-main">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task._id, { completed: !task.completed })}
                  className="todo-checkbox"
                />

                {editingTaskId === task._id ? (
                  <div className="todo-edit">
                    <input type="text" value={editingTitle} onChange={handleEditChange} className="edit-input" />
                    <button
                      onClick={() => {
                        updateTask(task._id, { title: editingTitle });
                        setEditingTaskId(null);
                      }}
                      className="save-button"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="todo-info">
                    <span className={`todo-title ${task.completed ? "completed" : ""}`}>{task.title}</span>
                    {task.dueDate && (
                      <span className={`due-date ${isOverdue(task.dueDate) ? "overdue" : ""}`}>
                        Due: {formatDate(task.dueDate)}
                      </span>
                    )}
                    <span className="priority-tag">
                      {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Low"} Priority
                    </span>
                  </div>
                )}
              </div>

              <div className="todo-actions">
                <button onClick={() => deleteTask(task._id)} className="delete-button" title="Delete Task">
                  Delete
                </button>
                <button
                  onClick={() => {
                    startEditing(task._id);
                    setEditingTitle(task.title);
                  }}
                  className="edit-button"
                  title="Edit Task"
                >
                  Edit
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// BLOCK 5: Exporting the Component
export default TodoList;
