import { Router } from "express";
import { getHealthInfo } from "../controllers/healthController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(protect), asyncHandler(getHealthInfo));

export default router;
