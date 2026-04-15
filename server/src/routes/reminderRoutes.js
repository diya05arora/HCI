import { Router } from "express";
import {
  getReminders,
  createReminder,
  updateReminderStatus,
  deleteReminder
} from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(getReminders));
router.post("/", asyncHandler(protect), asyncHandler(createReminder));
router.patch("/:id", asyncHandler(protect), asyncHandler(updateReminderStatus));
router.delete("/:id", asyncHandler(protect), asyncHandler(deleteReminder));

export default router;