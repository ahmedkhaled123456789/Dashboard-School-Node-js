const AysncHandler = require("express-async-handler");
const Parents = require("../models/Parents");
const Admin = require("../models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const { validateImage, normalizeImage } = require("../utils/userImage");

//@desc  Admin Register Parents
//@route POST /api/v1/parents/admins/register
//@acess  Private
exports.adminRegisterParents = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    student,
    phone,
    address,
    occupation,
    religion,
    image,
  } = req.body;
  if (image !== undefined) {
    const imageError = validateImage(image);
    if (imageError) {
      return next(new ApiError(imageError, 400));
    }
  }
  if (!password) {
    return next(new ApiError("Password is required", 400));
  }

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    return next(new ApiError("Admin not found", 404));
  }
  //check if Parents already exists
  const parents = await Parents.findOne({ email });
  if (parents) {
    return next(new ApiError("Parent already exists", 400));
  }

  // create
  const parentsCreated = await Parents.create({
    name,
    email,
    phone,
    address,
    occupation,
    religion,
    student,
    image: image ? normalizeImage(image) : undefined,
    password: await bcrypt.hash(password, 12),
  });
  //push Parents into admin
  await Admin.findByIdAndUpdate(adminFound._id, {
    $push: { parents: parentsCreated._id },
  });
  //send Parents data
  res.status(201).json({
    status: "success",
    message: "Parents registered successfully",
    data: parentsCreated,
  });
});

//@desc    login a Parents
//@route   POST /api/v1/parents/login
//@access  Public
exports.loginParents = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const parents = await Parents.findOne({ email });

  if (!parents || !(await bcrypt.compare(password || "", parents.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  res.status(200).json({
    status: "success",
    message: "Parents logged in successfully",
    token: createToken(parents._id),
    data: parents,
  });
});

//@desc    Get all Parents
//@route   GET /api/v1/parents/admin
//@access  Private admin only
exports.getAllParentsAdmin = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc    Get Single Parents
//@route   GET /api/v1/parents/:parentID/admin
//@access  Private admin only
exports.getParentsByAdmin = AysncHandler(async (req, res, next) => {
  const parents = await Parents.findById(req.params.parentID);
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Parent fetched successfully",
    data: parents,
  });
});

//@desc    Parent Profile
//@route   GET /api/v1/parents/profile
//@access  Private Parents only
exports.getParentsProfile = AysncHandler(async (req, res, next) => {
  const parents = await Parents.findById(req.userAuth._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: parents,
    message: "Parent Profile fetched  successfully",
  });
});

//@desc     Admin updating Parents profile
//@route    PUT /api/v1/parents/:parentID/admin
//@access   Private Admin only
exports.adminUpdateParents = AysncHandler(async (req, res, next) => {
  const { parentID } = req.params;

  const {
    email,
    name,
    password,
    phone,
    address,
    occupation,
    religion,
    student,
    image,
  } = req.body;
  if (image !== undefined) {
    const imageError = validateImage(image);
    if (imageError) {
      return next(new ApiError(imageError, 400));
    }
  }
  //if email is taken by another parent
  if (email) {
    const emailExist = await Parents.findOne({ email, _id: { $ne: parentID } });
    if (emailExist) {
      return next(new ApiError("This email is taken/exist", 400));
    }
  }

  const update = { email, name, phone, address, occupation, religion, student };
  if (image !== undefined) {
    update.image = normalizeImage(image);
  }
  //check if user is updating password
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }

  const parents = await Parents.findByIdAndUpdate(parentID, update, {
    new: true,
    runValidators: true,
  });
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: parents,
    message: "Parent updated successfully",
  });
});

//@desc     Admin deleting Parents
//@route    DELETE /api/v1/parents/:parentID/admin
//@access   Private Admin only
exports.deleteParents = AysncHandler(async (req, res, next) => {
  const parents = await Parents.findByIdAndDelete(req.params.parentID);
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  await Admin.updateMany({}, { $pull: { parents: parents._id } });
  res.status(200).json({
    status: "success",
    message: "Parent deleted successfully",
  });
});
