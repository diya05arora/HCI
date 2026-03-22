import { HealthInfo } from "../models/HealthInfo.js";

export const getHealthInfo = async (_req, res) => {
  const records = await HealthInfo.find().sort({ createdAt: 1 });
  return res.json(records);
};
