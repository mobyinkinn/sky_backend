import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Events } from "../models/event.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";

const createEvent = asyncHandler(async (req, res) => {
  const { title, content, slug } = req.body;
  if (!title || !content || !slug) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }
  const existing = await Events.findOne({ slug });
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

  const event = await Events.create({
    title,
    content,
    slug,
    image: image.url,
  });

  if (!event) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the event!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Event created!!!", event));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Events.find();
  res.status(200).json(new ApiResponse(200, "Events found!!!", events));
});

// const updateEvents = asyncHandler(async (req, res) => {
//   const { title, content } = req.body;

//   if (!title && !content) {
//     throw new ApiError(400, "All fields are empty!!!");
//   }

//   const existingEvents = await Events.findById(req.query.id);

//   if (!existingEvents) {
//     throw new ApiError(400, "No event found!!!");
//   }

//   const filter = {};
//   if (title) filter.title = title;
//   if (content) filter.content = content;

//   const updatedEvents = await Events.findByIdAndUpdate(req.query.id, filter, {
//     new: true,
//   });

//   res
//     .status(200)
//     .json(new ApiResponse(200, "Events updated successfully", updatedEvents));
// });

const deleteEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteEvents = await Events.findByIdAndDelete(id);
    res.json({
      deleteEvents,
      statusCode: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const blockEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id); // Make sure this function is correctly implemented

  try {
    const blockevent = await Events.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    if (!blockevent) {
      return res
        .status(404)
        .json({ message: "Events not found", statusCode: 400 });
    }
    res.json({ message: "Events Hide successfully", statusCode: 200 });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: error.message });
  }
});

const UnblockEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await Events.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    if (!unblock) {
      return res
        .status(404)
        .json({ message: "Events not found", statusCode: 400 });
    }
    res.json({ message: "Events unhide successfully", statusCode: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, slug } = req.body;

  console.log("id: ", id);
  // Validate MongoDB ID
  validateMongoDbId(id);

  try {
    // Find the existing event by ID
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Events not found" });
    }

    // Check if the slug is being updated and already exists
    if (slug && slug !== event.slug) {
      const existingSlug = await Events.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    // Update the event with the new data
    const updatedEvents = await Events.findByIdAndUpdate(
      id,
      {
        title,
        content,
        slug,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvents) {
      return res.status(404).json({ message: "Events not found" });
    }

    // Respond with the updated event data
    res.json({
      message: "Events updated successfully",
      updatedEvents,
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

  const updatedEvents = await Events.findByIdAndUpdate(
    req.params.id,
    {
      image: image.url,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Image updated successfully", updatedEvents));
});

export {
  createEvent,
  getAllEvents,
  updateEvents,
  updateImage,
  blockEvents,
  UnblockEvents,
  deleteEvents,
};
