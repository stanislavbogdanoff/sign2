// BLOCK 1: Importing Dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./components/TodoList.tsx";
import TagSelector from "./components/TagSelector.tsx";
import TagManager from "./components/TagManager.tsx";
import CategoryManager from "./components/CategoryManager.tsx";
import CategorySelector from "./components/CategorySelector.tsx";
import "./App.css";

// BLOCK 2: Defining Interfaces
interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: "high" | "medium" | "low" | null;
  tags: Tag[];
  category: string | null;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  taskCount: number;
}

// BLOCK 3: Setting Up State Variables
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [task, setTask] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // BLOCK 4: Fetch tasks and tags from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, tagsResponse, categoriesResponse] = await Promise.all([
          axios.get<Task[]>(`http://localhost:5000/api/tasks`),
          axios.get<Tag[]>(`http://localhost:5000/api/tags`),
          axios.get<Category[]>(`http://localhost:5000/api/categories`),
        ]);
        setTasks(tasksResponse.data);
        setTags(tagsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // BLOCK 5: Adding a Task
  const addTask = async () => {
    if (!task) return;

    try {
      const response = await axios.post<Task>(
        `http://localhost:5000/api/tasks`,
        {
          title: task,
          dueDate: dueDate || null,
          priority: priority,
          tags: selectedTags,
          category: selectedCategory,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      // Update tasks with the populated response data
      const newTask = response.data;
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // Reset form
      setTask("");
      setDueDate("");
      setPriority("medium");
      setSelectedTags([]);
      setSelectedCategory(null);
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

  // BLOCK 8: Handling Tags
  const handleTagChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (filter === "completed" && !task.completed) return false;
    if (filter === "active" && task.completed) return false;

    // Category filter
    if (filterCategory && task.category !== filterCategory) return false;

    // Tags filter
    if (filterTags.length > 0 && !filterTags.every((tagId) => task.tags.some((taskTag) => taskTag._id === tagId)))
      return false;

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

      <TagManager
        tags={tags}
        onTagsUpdate={() => {
          axios
            .get<Tag[]>(`http://localhost:5000/api/tags`)
            .then((response) => setTags(response.data))
            .catch((error) => console.error("Error fetching tags:", error));
        }}
      />

      <CategoryManager
        categories={categories}
        onCategoriesUpdate={() => {
          axios
            .get<Category[]>(`http://localhost:5000/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Error fetching categories:", error));
        }}
      />

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
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <TagSelector tags={tags} selectedTags={selectedTags} onChange={handleTagChange} />
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
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="filter-tags">
            <TagSelector tags={tags} selectedTags={filterTags} onChange={setFilterTags} />
          </div>

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
        categories={categories}
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
