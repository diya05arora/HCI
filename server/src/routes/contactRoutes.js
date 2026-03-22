import { Router } from "express";
import {
  getEmergencyContacts,
  placeEmergencyCall
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(getEmergencyContacts));
router.post("/call", asyncHandler(protect), asyncHandler(placeEmergencyCall));

export default router;
