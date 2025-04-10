import React from "react";
import "./CategorySelector.css";

interface Category {
  _id: string;
  name: string;
  color: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onChange: (categoryId: string | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="category-selector">
      <select
        value={selectedCategory || ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className="category-select"
      >
        <option value="">No Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
