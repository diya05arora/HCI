import { MedicineReminder } from "../models/MedicineReminder.js";

export const getReminders = async (_req, res) => {
  const reminders = await MedicineReminder.find().sort({ createdAt: 1 });
  return res.json(reminders);
};

export const createReminder = async (req, res) => {
  const { medicineName, dosage, timeLabel } = req.body;

  if (!medicineName || !dosage || !timeLabel) {
    return res.status(400).json({ message: "medicineName, dosage and timeLabel are required." });
  }

  const reminder = await MedicineReminder.create({
    medicineName: String(medicineName).trim(),
    dosage: String(dosage).trim(),
    timeLabel: String(timeLabel).trim(),
    taken: false
  });

  return res.status(201).json(reminder);
};

export const updateReminderStatus = async (req, res) => {
  const { id } = req.params;
  const { taken } = req.body;

  const reminder = await MedicineReminder.findByIdAndUpdate(
    id,
    { taken: Boolean(taken) },
    { new: true }
  );

  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found." });
  }

  return res.json(reminder);
};

export const deleteReminder = async (req, res) => {
  const { id } = req.params;
  const reminder = await MedicineReminder.findByIdAndDelete(id);

  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found." });
  }

  return res.json({ ok: true });
};