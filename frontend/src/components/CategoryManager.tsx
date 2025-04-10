import React, { useState } from "react";
import axios from "axios";
import "./CategoryManager.css";

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  taskCount: number;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesUpdate: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onCategoriesUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#42dcff");

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/categories", {
        name: newCategoryName,
        description: newCategoryDescription,
        color: newCategoryColor,
      });
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryColor("#42dcff");
      onCategoriesUpdate();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
      onCategoriesUpdate();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="category-manager">
      <h2>Manage Categories</h2>
      <div className="category-form">
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="category-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <input
              type="text"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              className="category-input"
            />
          </div>
          <div className="color-group">
            <label className="input-label">Color</label>
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="color-picker"
            />
          </div>
        </div>
        <div className="button-row">
          <button onClick={createCategory} className="create-category-btn">
            <i className="fas fa-plus"></i> Create Category
          </button>
        </div>
      </div>

      <div className="categories-list">
        {categories.map((category) => (
          <div key={category._id} className="category-item-manager" style={{ borderColor: category.color }}>
            <div className="category-info">
              <span className="category-name" style={{ color: category.color }}>
                <i className="fas fa-folder"></i> {category.name}
              </span>
              {category.description && <span className="category-description">{category.description}</span>}
              <span className="task-count">
                {category.taskCount} {category.taskCount === 1 ? "task" : "tasks"}
              </span>
            </div>
            <button
              onClick={() => deleteCategory(category._id)}
              className="delete-category-btn"
              title="Delete Category"
            >
              &#10799;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
