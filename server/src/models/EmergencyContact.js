import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    priority: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);
