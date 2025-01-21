const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new task
router.post("/", async (req, res) => {
    const { title } = req.body;
    console.log("Received title:", title); // Debugging log

    if (!title) {
        return res.status(400).json({ error: "Task title is required" });
    }

    try {
        const newTask = new Task({ title });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a task
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title },
        { new: true } // Return updated task
      );
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Error updating task" });
    }
  });
  

module.exports = router;