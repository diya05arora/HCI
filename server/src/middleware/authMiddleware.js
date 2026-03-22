import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized. Missing token.");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id fullName email role");

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists.");
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401);
    throw new Error("Not authorized. Invalid token.");
  }
};

export const caregiverOnly = (req, res, next) => {
  if (req.user?.role !== "caregiver") {
    res.status(403);
    throw new Error("Only caregivers can access this resource.");
  }

  next();
};
