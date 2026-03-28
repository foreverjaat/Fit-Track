
import mongoose from "mongoose";
import Workout  from "../models/Workout.js";
import Progress from "../models/Progress.js";


const getStats = async (req, res) => {
  try {
    const userId    = req.user._id;
    const userObjId = new mongoose.Types.ObjectId(userId);

    const now      = new Date();
    const weekAgo  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);

    // Run all queries in parallel for performance
    const [
      totalWorkouts,
      weekWorkouts,
      aggregateResult,
      categoryBreakdown,
      last7DaysData,
      recentWorkouts,
      latestProgress,
    ] = await Promise.all([

      // Total workouts count
      Workout.countDocuments({ user: userId }),

      // This week workouts count
      Workout.countDocuments({ user: userId, date: { $gte: weekAgo } }),

      // Total calories + total duration
      Workout.aggregate([
        { $match: { user: userObjId } },
        { $group: {
          _id: null,
          totalCalories: { $sum: "$caloriesBurned" },
          totalDuration: { $sum: "$duration" },
        }},
      ]),

      // Category breakdown for pie chart
      Workout.aggregate([
        { $match: { user: userObjId } },
        { $group: {
          _id:      "$category",
          count:    { $sum: 1 },
          calories: { $sum: "$caloriesBurned" },
        }},
        { $sort: { count: -1 } },
      ]),

      // Last 7 days grouped by date for bar chart
      Workout.aggregate([
        { $match: { user: userObjId, date: { $gte: weekAgo } } },
        { $group: {
          _id:      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          calories: { $sum: "$caloriesBurned" },
          count:    { $sum: 1 },
          duration: { $sum: "$duration" },
        }},
        { $sort: { _id: 1 } },
      ]),

      // 5 most recent workouts
      Workout.find({ user: userId }).sort({ date: -1 }).limit(5),

      // Latest progress log
      Progress.findOne({ user: userId }).sort({ date: -1 }),
    ]);

    res.json({
      totalWorkouts,
      weekWorkouts,
      totalCalories:     aggregateResult[0]?.totalCalories || 0,
      totalDuration:     aggregateResult[0]?.totalDuration || 0,
      categoryBreakdown,
      last7Days:         last7DaysData,
      recentWorkouts,
      currentWeight:     latestProgress?.weight || req.user.weight || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getStats };
