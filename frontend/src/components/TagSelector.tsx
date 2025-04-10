import React from "react";
import "./TagSelector.css";

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTags, onChange }) => {
  const handleTagClick = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onChange(newSelectedTags);
  };

  return (
    <div className="tag-selector">
      <div className="tag-list">
        {tags.map((tag) => (
          <button
            key={tag._id}
            className={`tag-item ${selectedTags.includes(tag._id) ? "selected" : ""}`}
            style={{
              borderColor: tag.color,
              backgroundColor: selectedTags.includes(tag._id) ? tag.color : "transparent",
              color: selectedTags.includes(tag._id) ? "#fff" : tag.color,
            }}
            onClick={() => handleTagClick(tag._id)}
          >
            <i className="fas fa-tag"></i>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
