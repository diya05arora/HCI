import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName:     { type: String, default: "" },
    hospitalId:      { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", default: null },
    hospitalName:    { type: String, default: "" },
    hospitalBranch:  { type: String, default: "" },
    doctorName:      { type: String, required: true },
    doctorId:        { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    specialty:       { type: String, default: "General Checkup" },
    appointmentDate: { type: Date, required: true },
    notes:           { type: String, default: "" },
    type:            { type: String, enum: ["doctor", "hospital", "lab", "specialist"], default: "doctor" },
    reminderSent:    { type: Boolean, default: false },
    completed:       { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);