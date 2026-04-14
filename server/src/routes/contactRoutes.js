import { Router } from "express";
import {
  createEmergencyContact,
  getEmergencyContacts,
  placeEmergencyCall
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(getEmergencyContacts));
router.post("/", asyncHandler(protect), asyncHandler(createEmergencyContact));
router.post("/call", asyncHandler(protect), asyncHandler(placeEmergencyCall));

export default router;
