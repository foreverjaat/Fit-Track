
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  sets:     { type: Number, default: 0 },
  reps:     { type: Number, default: 0 },
  weight:   {type: String, enum: ["Light", "Moderate", "Heavy"], default: "Light" },
  duration: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core", "Cardio", "Full Body"],
      required: true,
    },
    exercises:      { type: [exerciseSchema], default: [] },
    caloriesBurned: { type: Number, default: 0 },
    duration:       { type: Number, default: 0 },
    notes:          { type: String, default: "" },
    date:           { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
