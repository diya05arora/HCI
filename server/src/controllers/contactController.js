import { EmergencyContact } from "../models/EmergencyContact.js";

export const getEmergencyContacts = async (_req, res) => {
  const contacts = await EmergencyContact.find().sort({ priority: 1 });
  return res.json(contacts);
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
