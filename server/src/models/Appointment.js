import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorName: { 
      type: String, 
      required: true 
    },
    specialty: { 
      type: String, 
      default: "General Checkup" 
    },
    appointmentDate: { 
      type: Date, 
      required: true 
    },
    location: { 
      type: String, 
      default: "" 
    },
    notes: { 
      type: String, 
      default: "" 
    },
    type: {
      type: String,
      enum: ["doctor", "hospital", "lab", "specialist"],
      default: "doctor"
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
