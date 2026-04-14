import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import caregiverRoutes from "./routes/caregiverRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/status", (_req, res) => {
  res.json({ ok: true, service: "hui-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/health-info", healthRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/caregiver", caregiverRoutes);
app.use("/api", appointmentRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
