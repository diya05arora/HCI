import mongoose from "mongoose";

const medicineReminderSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    timeLabel: { type: String, required: true },
    taken: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const MedicineReminder = mongoose.model(
  "MedicineReminder",
  medicineReminderSchema
);
