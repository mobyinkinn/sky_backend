// models/Metadata.js
import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema({
  FirstName: { type: String, required: true, trim: true },
  LastName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  PhoneNumber: { type: String, required: true, trim: true },
  CompanyName: { type: String, required: true, trim: true },
  Category: { type: String, required: true, trim: true },
  Message: { type: String, required: true, trim: true },
});

export const ContactForm = mongoose.model("ContactForm", ContactSchema);
