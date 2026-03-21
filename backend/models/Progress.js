import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight:  { type: Number, required: [true, "Weight is required"] },
    bodyFat: { type: Number, default: null },
    chest:   { type: Number, default: null },
    waist:   { type: Number, default: null },
    hips:    { type: Number, default: null },
    arms:    { type: Number, default: null },
    date:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
