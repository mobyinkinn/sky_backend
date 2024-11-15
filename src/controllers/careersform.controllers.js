import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CareersForm } from "../models/careersform.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";


const createCareers = asyncHandler(async (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Position, NoticePeriod } =
    req.body;
  if (!FirstName || !LastName || !Email || !PhoneNumber || !Position || !NoticePeriod) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }
  const existing = await CareersForm.findOne({ Email });
  if (existing) {
    throw new ApiError(400, "Email");
  }
  console.log("aefd",req.files)
  const imageLocalPath = req.files?.file[0].path;

  if (!imageLocalPath) {
    throw new ApiError(400, "File is required!!!");
  }

  const file = await uploadOnCloudinary(imageLocalPath);

  if (!file) {
    throw new ApiError(500, "File failed to upload!!!");
  }

  const careersform = await CareersForm.create({
    FirstName,
    LastName,
    Email,
    PhoneNumber,
    Position,
    NoticePeriod,
    Resume:file.url

  });

  if (!careersform) {
    throw new ApiError(500, "Something went wrong while uploading the blog!!!");
  }

  res.status(200).json(new ApiResponse(200, "application created!!!", careersform));
});

const getAllCareers = asyncHandler(async (req, res) => {
  const careersform = await CareersForm.find();
  res.status(200).json(new ApiResponse(200, "Careers found!!!", careersform));
});
const deleteCareersappl= asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecareer = await CareersForm.findByIdAndDelete(id);
    res.json({
      deletecareer,
      statusCode: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createCareers,
  getAllCareers,
  deleteCareersappl,
};