import { CaregiverProfile } from "../models/CaregiverProfile.js";

export const getCaregiverProfile = async (req, res) => {
  const profile = await CaregiverProfile.findOne({ userId: req.user._id });

  return res.json(
    profile || {
      relationshipToElder: "",
      elderName: "",
      elderAge: "",
      notes: ""
    }
  );
};

export const upsertCaregiverProfile = async (req, res) => {
  const { relationshipToElder, elderName, elderAge, notes } = req.body;

  if (!relationshipToElder || !elderName || !elderAge) {
    res.status(400);
    throw new Error("Relationship, elder name, and elder age are required.");
  }

  const profile = await CaregiverProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      userId: req.user._id,
      relationshipToElder,
      elderName,
      elderAge: Number(elderAge),
      notes: notes || ""
    },
    { upsert: true, new: true }
  );

  return res.json(profile);
};
