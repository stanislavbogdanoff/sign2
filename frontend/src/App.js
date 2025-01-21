import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./components/TodoList";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks`);
        console.log("Fetched tasks:", response.data); // Debugging log
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:",error);
      }
    };
    fetchTasks();
  }, []);

  //Add a new task
  const addTask = async () => {
    if (!task) return;

    try {
      console.log("Adding task:", task); // Debugging log
      const response = await axios.post(`http://localhost:5000/api/tasks`,
        { title: task },
        { headers: { "Content-Type": "application/json"}}
       );
      console.log("Task added response:", response.data);
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <TodoList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
};

export default App;