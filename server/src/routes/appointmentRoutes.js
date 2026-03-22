import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  markAppointmentComplete
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Get all appointments for a user
router.get("/:userId", asyncHandler(protect), asyncHandler(getAppointments));

// Create new appointment
router.post("/:userId", asyncHandler(protect), asyncHandler(createAppointment));

// Update appointment
router.patch("/:id", asyncHandler(protect), asyncHandler(updateAppointment));

// Delete appointment
router.delete("/:id", asyncHandler(protect), asyncHandler(deleteAppointment));

// Mark appointment as completed
router.patch("/:id/complete", asyncHandler(protect), asyncHandler(markAppointmentComplete));

export default router;
