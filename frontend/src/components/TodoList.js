import React from "react";

const TodoList = ({ tasks, deleteTask }) => {
    return (
        <ul>
            {tasks.map((task, index) => (
                task ? (
                <li key={task._id || index}>
                    {task.title || "Untitled Task"}
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                </li>
                ) : (
                    <li key={index}>Invalid Task</li>
                )
            ))}
        </ul>
    );
};

export default TodoList;