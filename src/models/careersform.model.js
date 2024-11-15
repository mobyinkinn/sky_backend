// models/Metadata.js
import mongoose, { Schema } from "mongoose";

const careersformSchema = new Schema({
  FirstName: { type: String, required: true, trim: true },
  LastName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  PhoneNumber: { type: String, required: true, trim: true },
  Position: { type: String, required: true, trim: true },
  NoticePeriod: { type: String, required: true, trim: true },
  Resume: {
    type: String,
    required: true,
    trim: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
    trim: true,
  },
});

export const CareersForm = mongoose.model("CareersForm", careersformSchema);
