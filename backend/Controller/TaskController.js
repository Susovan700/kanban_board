import TaskModel from "../Models/TaskModel.js";
import { io } from '../index.js';

// 1. ADD Task
export const addTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // We count how many tasks are already in this specific column
    const count = await TaskModel.countDocuments({ status });

    const newTask = new TaskModel({
      title,
      description,
      status,
      position: count, // New task goes to the bottom
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
};

// 2. GET All Tasks (Sorted by position)
export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find().sort({ position: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// 3. DELETE Task
export const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// 4. MOVE Task (The Address Change)
export const moveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, newPosition } = req.body;

    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = newStatus || task.status;
    task.position = newPosition;
    
    await task.save();

    io.emit('taskMoved', { id, newStatus, newPosition });
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error moving task", error: error.message });
  }
};