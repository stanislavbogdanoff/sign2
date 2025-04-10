// BOCK 1: Import dependencies
const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the task
 *         title:
 *           type: string
 *           description: Title of the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *           default: false
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Due date of the task
 *           nullable: true
 *         priority:
 *           type: string
 *           enum: [high, medium, low]
 *           description: Priority level of the task
 *           default: medium
 */

// BLOCK 2: GET all tasks
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("tags").populate("category");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BLOCK 3: POST a new task
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Tags from request:", req.body.tags);
    console.log("Type of tags:", typeof req.body.tags);

    const { title, dueDate, priority, tags, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    // Explicitly convert tag IDs to ObjectId if needed
    const Tag = require("../models/Tag");
    let tagIds = [];
    if (Array.isArray(req.body.tags)) {
      tagIds = req.body.tags;
    } else if (typeof req.body.tags === "string") {
      tagIds = [req.body.tags];
    }

    console.log("Processed tag IDs:", tagIds);

    const newTask = new Task({
      title,
      dueDate: dueDate || null,
      priority: priority || "medium",
      tags: tagIds,
      category: category || null,
    });

    console.log("Task before save:", newTask);
    const savedTask = await newTask.save();
    console.log("Task after save:", savedTask);

    const populatedTask = await Task.findById(savedTask._id).populate("tags").populate("category").lean().exec();

    console.log("Final populated task:", populatedTask);
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
});

// BLOCK 4: DELETE a task
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BLOCK 5: UPDATE a task
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Ensure tags is an array if present
    if ("tags" in updateData) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("tags");

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
});

// BLOCK 6: Export the router
module.exports = router;
