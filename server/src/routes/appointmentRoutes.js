import express from "express";
import { Appointment } from "../models/Appointment.js";
import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ─── HOSPITAL / SPECIALTY / DOCTOR ROUTES ─────────────────────────────────────

router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).sort({ name: 1, branch: 1 });
    res.json({ hospitals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

router.get("/specialties", async (req, res) => {
  const { hospitalId } = req.query;
  if (!hospitalId) return res.status(400).json({ error: "hospitalId is required" });
  try {
    const specialties = await Doctor.distinct("specialty", { hospitalId });
    res.json({ specialties: specialties.sort() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch specialties" });
  }
});

router.get("/doctors", async (req, res) => {
  const { hospitalId, specialty } = req.query;
  if (!hospitalId || !specialty) {
    return res.status(400).json({ error: "hospitalId and specialty are required" });
  }
  try {
    const doctors = await Doctor.find({ hospitalId, specialty }).sort({ name: 1 });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ─── APPOINTMENT CRUD ROUTES ───────────────────────────────────────────────────

// GET /api/appointments/:userId
router.get("/appointments/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId }).sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// POST /api/appointments/:userId
router.post("/appointments/:userId", async (req, res) => {
  try {
    const { patientName, hospitalId, hospitalName, hospitalBranch, specialty, doctorName, doctorId, appointmentDate, notes, type } = req.body;
    if (!doctorName || !appointmentDate) {
      return res.status(400).json({ error: "doctorName and appointmentDate are required" });
    }
    const appointment = await Appointment.create({
      userId:          req.params.userId,
      patientName:     patientName    || "",
      hospitalId:      hospitalId     || null,
      hospitalName:    hospitalName   || "",
      hospitalBranch:  hospitalBranch || "",
      specialty:       specialty      || "General Checkup",
      doctorName:      doctorName,
      doctorId:        doctorId       || null,
      appointmentDate: new Date(appointmentDate),
      notes:           notes          || "",
      type:            type           || "doctor",
      completed:       false
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// DELETE /api/appointments/:id
router.delete("/appointments/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// PATCH /api/appointments/:id/complete
router.patch("/appointments/:id/complete", async (req, res) => {
  try {
    const apt = await Appointment.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ error: "Failed to complete appointment" });
  }
});

// PATCH /api/appointments/:id/reschedule
router.patch("/appointments/:id/reschedule", async (req, res) => {
  try {
    const apt = await Appointment.findByIdAndUpdate(req.params.id, { appointmentDate: new Date(req.body.appointmentDate) }, { new: true });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
});

export default router;



