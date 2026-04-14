import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
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

userSchema.pre("validate", function ensureIdentifier(next) {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone is required.");
  }
  next();
});

export const User = mongoose.model("User", userSchema);
