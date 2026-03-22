import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["elderly", "caregiver"],
      required: true,
      default: "elderly"
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
