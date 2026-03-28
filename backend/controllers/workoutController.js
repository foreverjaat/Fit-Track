
import Workout from "../models/Workout.js";


const getWorkouts = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, startDate, endDate } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const total    = await Workout.countDocuments(filter);
    const workouts = await Workout.find(filter)
      .sort({ date: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit);

    res.json({ workouts, total, page: +page, totalPages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createWorkout = async (req, res) => {
  try {
    const { title, category, exercises, caloriesBurned, duration, notes, date } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      title, 
      category,
       exercises,
      caloriesBurned,
       duration,
        notes,
         date,
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout };
