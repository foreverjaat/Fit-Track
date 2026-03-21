
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();

router.use(protect); // All workout routes are protected

router.route("/")
  .get(getWorkouts)
  .post(createWorkout);

router.route("/:id")
  .get(getWorkout)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;
