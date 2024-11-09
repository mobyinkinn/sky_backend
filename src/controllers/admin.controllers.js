import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while creating refresh and access tokens"
    );
  }
};

const createAdmin = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new ApiError(400, "Please fill thr required fields");
  }

  const existingAdmin = await Admin.find({ username });

  if (existingAdmin.length > 0) {
    throw new ApiError(400, "Admin already exists!!!");
  }

  const admin = await Admin.create(req.body);

  if (!admin) {
    throw new ApiError(500, "Something went wrong while creating the admin!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Admin created successfully!!!", admin));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password is required!!!");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin does not exists!!!");
  }

  const isPasswordValid = admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpONly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});

const updateAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    throw new ApiError(400, "All fields are empty");
  }

  const filter = {};
  if (username) filter.username = username;
  if (email) filter.email = email;
  if (password) filter.password = password;

  const adminExists = await Admin.findById(req.query.id);
  if (!adminExists) {
    throw new ApiError(400, "No admin found!!!");
  }

  const uniqueAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (uniqueAdmin) {
    throw new ApiError(400, "Username or email already exists");
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(req.query.id, filter, {
    new: true,
  });

  if (!updatedAdmin) {
    throw new ApiError(500, "Something went wrong while updating the admin");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Admin updated successfully!!!", updatedAdmin));
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json(new ApiResponse(200, "Admins found!!!", admins));
});

const getById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.query.id);

  if (!admin) {
    throw new ApiError(400, "No admin found");
  }

  res.status(200).json(new ApiResponse(200, "Admins found!!!", admin));
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.query.id);
  if (!admin) {
    throw new ApiError(400, "No such admin exists");
  }

  const deletedAdmin = await Admin.findByIdAndDelete(req.query.id);
  res.status(200).json(new ApiResponse(200, "Admins deleted!!!"));
});

export { createAdmin, updateAdmin, getAllAdmins, deleteAdmin, getById, login };
