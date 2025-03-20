import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    suggestedBlogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    metatitle: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: String, required: true },
    h1: { type: String, required: true },
    h2: { type: String, required: true },
    bold: { type: String, required: true },
    italic: { type: String, required: true },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
