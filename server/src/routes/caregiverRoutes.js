import { Router } from "express";
import {
  getCaregiverProfile,
  upsertCaregiverProfile
} from "../controllers/caregiverController.js";
import { caregiverOnly, protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/profile", asyncHandler(protect), asyncHandler(caregiverOnly), asyncHandler(getCaregiverProfile));
router.put("/profile", asyncHandler(protect), asyncHandler(caregiverOnly), asyncHandler(upsertCaregiverProfile));

export default router;
