import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProgress, addProgress, deleteProgress } from "../controllers/progressController.js";

const router = express.Router();

router.use(protect); // All progress routes are protected

router.route("/")
  .get(getProgress)
  .post(addProgress);

router.delete("/:id", deleteProgress);

export default router;
