
import Progress from "../models/Progress.js";

// @desc   Get all progress logs
// @route  GET /api/progress
const getProgress = async (req, res) => {
  try {
    const logs = await Progress.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Add a progress log
// @route  POST /api/progress
const addProgress = async (req, res) => {
  try {
    const { weight, bodyFat, chest, waist, hips, arms, date } = req.body;
    const log = await Progress.create({
      user: req.user._id,
      weight, bodyFat, chest, waist, hips, arms, date,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Delete a progress log
// @route  DELETE /api/progress/:id
const deleteProgress = async (req, res) => {
  try {
    const log = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!log) return res.status(404).json({ message: "Progress log not found" });
    res.json({ message: "Progress log deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getProgress, addProgress, deleteProgress };
