

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes      from "./routes/authRoutes.js";
import workoutRoutes   from "./routes/workoutRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import progressRoutes  from "./routes/progressRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || `https://fit-track-frontend-jit0.onrender.com`, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/workouts",  workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress",  progressRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FitTrack Pro API is running 💪" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running successfully`));
