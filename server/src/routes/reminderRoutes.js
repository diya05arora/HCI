import { Router } from "express";
import {
  getReminders,
  updateReminderStatus
} from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(getReminders));
router.patch("/:id", asyncHandler(protect), asyncHandler(updateReminderStatus));

export default router;
