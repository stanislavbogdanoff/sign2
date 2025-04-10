import React, { useState } from "react";
import axios from "axios";
import "./TagManager.css";

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface TagManagerProps {
  tags: Tag[];
  onTagsUpdate: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsUpdate }) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#42dcff");

  const createTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/tags", {
        name: newTagName,
        color: newTagColor,
      });
      setNewTagName("");
      setNewTagColor("#42dcff");
      onTagsUpdate();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tags/${tagId}`);
      onTagsUpdate();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div className="tag-manager">
      <h2>Manage Tags</h2>
      <div className="tag-form">
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Tag Name</label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="tag-input"
            />
          </div>
          <div className="color-group">
            <label className="input-label">Color</label>
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="color-picker"
            />
          </div>
        </div>
        <div className="button-row">
          <button onClick={createTag} className="create-tag-btn">
            <i className="fas fa-plus"></i> Create Tag
          </button>
        </div>
      </div>

      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag._id} className="tag-item-manager" style={{ borderColor: tag.color, color: tag.color }}>
            <span className="tag-name">
              <i className="fas fa-tag"></i> {tag.name}
            </span>
            <button onClick={() => deleteTag(tag._id)} className="delete-tag-btn" title="Delete Tag">
              &#10799;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
