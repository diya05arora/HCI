import { EmergencyContact } from "./models/EmergencyContact.js";
import { HealthInfo } from "./models/HealthInfo.js";
import { MedicineReminder } from "./models/MedicineReminder.js";

const defaultHealthInfo = [
  {
    title: "Stay Hydrated",
    summary: "Drink water regularly",
    details: "Try to drink one glass of water every 2 hours during the day.",
    audioText: "Stay hydrated. Drink one glass of water every 2 hours."
  },
  {
    title: "Light Daily Movement",
    summary: "Move for 15 minutes",
    details: "A short walk at home or outside can improve blood flow and mood.",
    audioText: "Move daily for at least 15 minutes to stay active."
  },
  {
    title: "Balanced Meals",
    summary: "Eat on time",
    details: "Take meals on time with vegetables, protein, and less salt.",
    audioText: "Eat balanced meals on time with vegetables and protein."
  }
];

const defaultReminders = [
  { medicineName: "Blood Pressure Tablet", dosage: "1 tablet", timeLabel: "8:00 AM", taken: false },
  { medicineName: "Vitamin D", dosage: "1 capsule", timeLabel: "1:00 PM", taken: false },
  { medicineName: "Diabetes Medicine", dosage: "1 tablet", timeLabel: "8:00 PM", taken: false }
];

const defaultContacts = [
  { name: "Dr. Mehta", relation: "Family Doctor", phone: "+91-9876543210", priority: 1 },
  { name: "Ananya", relation: "Daughter", phone: "+91-9876501234", priority: 2 },
  { name: "Ambulance", relation: "Emergency Service", phone: "108", priority: 0 }
];

export const seedIfNeeded = async () => {
  const [healthCount, reminderCount, contactCount] = await Promise.all([
    HealthInfo.countDocuments(),
    MedicineReminder.countDocuments(),
    EmergencyContact.countDocuments()
  ]);

  if (healthCount === 0) {
    await HealthInfo.insertMany(defaultHealthInfo);
  }

  if (reminderCount === 0) {
    await MedicineReminder.insertMany(defaultReminders);
  }

  if (contactCount === 0) {
    await EmergencyContact.insertMany(defaultContacts);
  }
};
