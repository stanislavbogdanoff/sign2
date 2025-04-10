// BLOCK 1: Importing Mongoose
const mongoose = require("mongoose");

// BLOCK 2: Defining Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    default: "",
  },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, default: null },
  priority: {
    type: String,
    enum: ["high", "medium", "low", null],
    default: "medium",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps
TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Store old tags before update
TaskSchema.pre("save", function (next) {
  if (this.isModified("tags")) {
    console.log("Tags modified. Old tags:", this.tags);
    this._oldTags = [...(this.tags || [])];
  }
  next();
});

// Update tag usage count
TaskSchema.post("save", async function () {
  if (this.isModified("tags")) {
    const Tag = mongoose.model("Tag");
    const oldTags = this._oldTags || [];
    const newTags = this.tags || [];

    console.log("Updating tag counts. Old:", oldTags, "New:", newTags);

    // Decrease count for removed tags
    for (const tagId of oldTags) {
      if (!newTags.includes(tagId)) {
        console.log("Decreasing count for tag:", tagId);
        await Tag.findByIdAndUpdate(tagId, { $inc: { usageCount: -1 } });
      }
    }

    // Increase count for new tags
    for (const tagId of newTags) {
      if (!oldTags.includes(tagId)) {
        console.log("Increasing count for tag:", tagId);
        await Tag.findByIdAndUpdate(tagId, { $inc: { usageCount: 1 } });
      }
    }
  }
});

// Update category count
TaskSchema.post("save", async function () {
  if (this.category) {
    const Category = mongoose.model("Category");
    await Category.findByIdAndUpdate(this.category, { $inc: { taskCount: 1 } });
  }
});

TaskSchema.post("remove", async function () {
  if (this.category) {
    const Category = mongoose.model("Category");
    await Category.findByIdAndUpdate(this.category, { $inc: { taskCount: -1 } });
  }
});

// BLOCK 3: Creating and Exporting the Model
module.exports = mongoose.model("Task", TaskSchema);
