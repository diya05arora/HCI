import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const register = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").trim().replace(/[\s-]/g, "");

  if (!fullName || !password || (!normalizedEmail && !normalizedPhone)) {
    res.status(400);
    throw new Error("Name, password, and email or phone are required.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  if (normalizedEmail && !EMAIL_REGEX.test(normalizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email address.");
  }

  if (normalizedPhone && !PHONE_REGEX.test(normalizedPhone)) {
    res.status(400);
    throw new Error("Please enter a valid phone number.");
  }

  const existingEmail = normalizedEmail ? await User.findOne({ email: normalizedEmail }) : null;
  const existingPhone = normalizedPhone ? await User.findOne({ phone: normalizedPhone }) : null;

  if (existingEmail) {
    res.status(409);
    throw new Error("Email already registered.");
  }

  if (existingPhone) {
    res.status(409);
    throw new Error("Phone number already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email: normalizedEmail || undefined,
    phone: normalizedPhone || undefined,
    passwordHash,
    role: role === "caregiver" ? "caregiver" : "elderly"
  });

  return res.status(201).json({
    token: createToken(user._id),
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
};

export const login = async (req, res) => {
  const { email, phone, password } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").trim().replace(/[\s-]/g, "");

  if (!normalizedEmail && !normalizedPhone) {
    res.status(400);
    throw new Error("Email or phone is required.");
  }

  const user = await User.findOne(normalizedPhone ? { phone: normalizedPhone } : { email: normalizedEmail });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email/phone or password.");
  }

  const isPasswordValid = await bcrypt.compare(password || "", user.passwordHash);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email/phone or password.");
  }

  return res.json({
    token: createToken(user._id),
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
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
      phone: req.user.phone,
      role: req.user.role
    }
  });
};
