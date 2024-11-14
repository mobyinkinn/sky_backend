import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, slug } = req.body;
  if (!title || !content || !slug) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }
  const existing = await Blog.findOne({ slug });
  if (existing) {
    throw new ApiError(400, "slug");
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
    slug,
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

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteBlog,
      statusCode: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const blockBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id); // Make sure this function is correctly implemented

  try {
    const blockblog = await Blog.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    if (!blockblog) {
      return res
        .status(404)
        .json({ message: "Blog not found", statusCode: 400 });
    }
    res.json({ message: "Blog Hide successfully", statusCode: 200 });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: error.message });
  }
});

const UnblockBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await Blog.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    if (!unblock) {
      return res
        .status(404)
        .json({ message: "Blog not found", statusCode: 400 });
    }
    res.json({ message: "Blog unhide successfully", statusCode: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, slug } = req.body;

  // Validate MongoDB ID
  validateMongoDbId(id);

  try {
    // Find the existing blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the slug is being updated and already exists
    if (slug && slug !== blog.slug) {
      const existingSlug = await Blog.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    // Update the blog with the new data
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        slug,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Respond with the updated blog data
    res.json({
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateImage = asyncHandler(async (req, res, next) => {
  const imageLocalPath = req.files.image[0].path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      image: image.url,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Image updated successfully", updatedBlog));
});

export {
  createBlog,
  getAllBlogs,
  updateBlog,
  updateImage,
  blockBlog,
  UnblockBlog,
  deleteBlog,
};
