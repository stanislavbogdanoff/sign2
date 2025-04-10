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
  dueDate: string | null;
  priority: "high" | "medium" | "low" | null;
}

// BLOCK 3: Setting Up State Variables
const App: React.FC = () => {
  // State for tasks, new task text, and editing controls
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate");

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
        {
          title: task,
          dueDate: dueDate || null,
          priority: priority,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("Task added response:", response.data);
      setTasks([...tasks, response.data]);
      setTask("");
      setDueDate("");
      setPriority("medium");
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
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask, {
        headers: { "Content-Type": "application/json" },
      });

      setTasks(tasks.map((task) => (task._id === id ? { ...task, ...response.data } : task)));
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority || "low"] - priorityOrder[b.priority || "low"];
    }
    return a.title.localeCompare(b.title);
  });

  // BLOCK 9: Render the app
  return (
    <div className="App">
      <h1>Todo App</h1>
      <div className="task-controls">
        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task title"
            className="task-title-input"
          />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="due-date-input" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
            className="priority-select"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button onClick={addTask} className="add-button">
            Add Task
          </button>
        </div>

        <div className="task-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "completed" | "active")}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "title")}
            className="sort-select"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <TodoList
        tasks={sortedTasks}
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
