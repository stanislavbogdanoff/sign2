import React from "react";

const TodoList = ({
  tasks, 
  deleteTask,
  updateTask,
  editingTitle,
  setEditingTitle,
  editingTaskId,
  setEditingTaskId,
  handleEditChange,

}) => {
    return (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {editingTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={handleEditChange}
                  />
                   <button onClick={() => {
                    updateTask(task._id, editingTitle); // Pass updated title
                    setEditingTaskId(null); // Exit editing mode
                  }}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                  <button onClick={() => {
                     setEditingTaskId(task._id);
                     setEditingTitle(task.title); // Initialize editing title
                     }}>
                     Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      );
    };
    
    export default TodoList;

