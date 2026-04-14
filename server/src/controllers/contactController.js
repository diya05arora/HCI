import { EmergencyContact } from "../models/EmergencyContact.js";

export const getEmergencyContacts = async (_req, res) => {
  const contacts = await EmergencyContact.find().sort({ priority: 1 });
  return res.json(contacts);
};

export const createEmergencyContact = async (req, res) => {
  const { name, relation, phone, priority } = req.body;

  if (!name || !relation || !phone) {
    return res.status(400).json({ message: "Name, relation, and phone are required." });
  }

  const contact = await EmergencyContact.create({
    name: String(name).trim(),
    relation: String(relation).trim(),
    phone: String(phone).trim(),
    priority: Number.isFinite(Number(priority)) ? Number(priority) : 1
  });

  return res.status(201).json(contact);
};

export const placeEmergencyCall = async (req, res) => {
  const { contactId } = req.body;

  const contact = await EmergencyContact.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found." });
  }

  return res.json({
    message: `Calling ${contact.name} at ${contact.phone}...`,
    callPlaced: true
  });
};
