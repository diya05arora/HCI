import mongoose from "mongoose";

const healthInfoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: String, required: true },
    audioText: { type: String, required: true }
  },
  { timestamps: true }
);

export const HealthInfo = mongoose.model("HealthInfo", healthInfoSchema);
