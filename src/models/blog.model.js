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
    suggestedBlogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
