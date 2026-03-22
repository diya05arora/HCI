import mongoose from "mongoose";

const caregiverProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    relationshipToElder: { type: String, required: true, trim: true },
    elderName: { type: String, required: true, trim: true },
    elderAge: { type: Number, min: 1, max: 120, required: true },
    notes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

export const CaregiverProfile = mongoose.model("CaregiverProfile", caregiverProfileSchema);
