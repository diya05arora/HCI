import { MedicineReminder } from "../models/MedicineReminder.js";

export const getReminders = async (_req, res) => {
  const reminders = await MedicineReminder.find().sort({ createdAt: 1 });
  return res.json(reminders);
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
