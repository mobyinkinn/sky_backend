// models/Metadata.js
import mongoose, { Schema } from "mongoose";

const careersSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

export const Careers = mongoose.model("Careers", careersSchema);
