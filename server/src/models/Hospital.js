
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  branch: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Hospital", hospitalSchema);
