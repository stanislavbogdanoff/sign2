const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#42dcff", // Default to our app's primary color
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  taskCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
