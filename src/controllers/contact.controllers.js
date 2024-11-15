import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContactForm } from "../models/contact.model.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";


const createContact = asyncHandler(async (req, res) => {
  const {
    FirstName,
    LastName,
    Email,
    PhoneNumber,
    CompanyName,
    Category,
    Message,
  } = req.body;
  if (
    !FirstName ||
    !LastName ||
    !Email ||
    !PhoneNumber ||
    !CompanyName ||
    !Category ||
    !Message
  ) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }

  const contactform = await ContactForm.create({
    FirstName,
    LastName,
    Email,
    PhoneNumber,
    CompanyName,
    Category,
    Message,
  });

  if (!contactform) {
    throw new ApiError(500, "Something went wrong while uploading the blog!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "application created!!!", contactform));
});
const getAllcotacts = asyncHandler(async (req, res) => {
  const contactform = await ContactForm.find();
  res.status(200).json(new ApiResponse(200, "Details found!!!", contactform));
});


const deleteContactdetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecontact= await ContactForm.findByIdAndDelete(id);
    res.json({
        message:"Deletes succesfully",
      deletecontact,
      statusCode: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export { createContact, getAllcotacts, deleteContactdetail };