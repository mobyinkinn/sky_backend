import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }

  const imageLocalPath = req.files?.image[0].path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const blog = await Blog.create({
    title,
    content,
    image: image.url,
  });

  if (!blog) {
    throw new ApiError(500, "Something went wrong while uploading the blog!!!");
  }

  res.status(200).json(new ApiResponse(200, "Blog created!!!", blog));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json(new ApiResponse(200, "Blogs found!!!", blogs));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const existingBlog = await Blog.findById(req.query.id);

  if (!existingBlog) {
    throw new ApiError(400, "No blog found!!!");
  }

  const filter = {};
  if (title) filter.title = title;
  if (content) filter.content = content;

  const updatedBlog = await Blog.findByIdAndUpdate(req.query.id, filter, {
    new: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully", updatedBlog));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const existingBlog = await Blog.findById(req.query.id);
  if (!existingBlog) {
    throw new ApiError(400, "No blog found!!!");
  }

  const deleteBlog = await Blog.findByIdAndDelete(req.query.id);
  res.status(200).json(new ApiResponse(200, "Blog deleted Successfyllly"));
});

export { createBlog, getAllBlogs, updateBlog, deleteBlog };
