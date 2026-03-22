import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Email already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role: role === "caregiver" ? "caregiver" : "elderly"
  });

  return res.status(201).json({
    token: createToken(user._id),
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password || "", user.passwordHash);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  return res.json({
    token: createToken(user._id),
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
};

export const me = async (req, res) => {
  return res.json({
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role
    }
  });
};
