// BLOCK 1: Importing Dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./components/TodoList.tsx";
import "./App.css";

// BLOCK 2: Defining Task Interface
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

// BLOCK 3: Setting Up State Variables
const App: React.FC = () => {
  // State for tasks, new task text, and editing controls
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  // BLOCK 4: Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(`http://localhost:5000/api/tasks`);
        console.log("Fetched tasks:", response.data); // Debugging log
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // BLOCK 5: Adding a Task
  const addTask = async () => {
    if (!task) return;

    try {
      console.log("Adding task:", task); // Debugging log
      const response = await axios.post<Task>(
        `http://localhost:5000/api/tasks`,
        { title: task },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Task added response:", response.data);
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // BLOCK 6: Delete a task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // BLOCK 7: Updating a Task
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updatedTask,
        { headers: { "Content-Type": "application/json" } }
      );

      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, ...response.data } : task
        )
      );
      setEditingTaskId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // BLOCK 8: Handling Edits
  const startEditing = (id: string) => {
    setEditingTaskId(id);
  };

  // Handle title change during editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  // BLOCK 9: Render the app
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

// BLOCK 10: Exporting the Component
export default App;
