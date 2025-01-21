import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./components/TodoList";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

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

  // Update a task
  const updateTask = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: editingTitle },
        { headers: { "Content-Type": "application/json" } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, title: response.data.title } : task
        )
      );
      setEditingTaskId(null); // Exit editing mode
      setEditingTitle(""); // Clear editing title
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Start editing a task
  const startEditing = (id) => {
    setEditingTaskId(id);
  };

  // Handle title change during editing
  const handleEditChange = (e) => {
    setEditingTitle(e.target.value);
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
      <TodoList 
      tasks={tasks} 
      deleteTask={deleteTask}
      updateTask={updateTask}
      editingTitle={editingTitle}
      setEditingTitle={setEditingTitle}
      editingTaskId={editingTaskId}
      setEditingTaskId={setEditingTaskId}
      startEditing={startEditing}
      handleEditChange={handleEditChange} 
      />
    </div>
  );
};

export default App;