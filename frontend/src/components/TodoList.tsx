// BLOCK 1: Importing Dependencies
import React from "react";

// BLOCK 2: Defining Interfaces
interface Task {
  _id: string; // Unique ID for the task
  title: string; // Task name
  completed: boolean; // True if done, False if not
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

  // BLOCK 4: Rendering the Task List and handling task actions
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => updateTask(task._id, { completed: !task.completed })}
          />
          {editingTaskId === task._id ? (
            <>
              <input type="text" value={editingTitle} onChange={handleEditChange} />
              <button
                onClick={() => {
                  updateTask(task._id, { title: editingTitle });
                  setEditingTaskId(null);
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
              </span>
              
              <div>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                <button
                  onClick={() => {
                    startEditing(task._id);
                    setEditingTitle(task.title);
                  }}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

// BLOCK 5: Exporting the Component
export default TodoList;
