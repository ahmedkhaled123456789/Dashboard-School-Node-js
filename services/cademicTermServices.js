const asyncHandler = require("express-async-handler");
const AcademicTerm = require("../models/AcademicTerm");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

exports.createAcademincTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  // check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    return next(new ApiError("academic term already exists", 400));
  }
  //craete
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });
  // push academic term into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { academicTerms: academicTermCreated._id },
  });
  res.status(201).json({
    status: "success",
    message: "academic term created successfully",
    data: academicTermCreated,
  });
});

exports.getAcademincTerms = asyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

exports.getAcademincTerm = asyncHandler(async (req, res, next) => {
  const term = await AcademicTerm.findById(req.params.id);
  if (!term) {
    return next(new ApiError("academic term not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "academic term fetched successfully",
    data: term,
  });
});

exports.updateAcademincTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  const { id } = req.params;
  // check if another term has the same name
  const academicTerm = await AcademicTerm.findOne({ name, _id: { $ne: id } });
  if (academicTerm) {
    return next(new ApiError("academic term already exists", 400));
  }
  const term = await AcademicTerm.findByIdAndUpdate(
    id,
    { name, description, duration },
    { new: true, runValidators: true }
  );
  if (!term) {
    return next(new ApiError("academic term not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "academic term update successfully",
    data: term,
  });
});

exports.deleteAcademincTerm = asyncHandler(async (req, res, next) => {
  const term = await AcademicTerm.findByIdAndDelete(req.params.id);
  if (!term) {
    return next(new ApiError("academic term not found", 404));
  }
  await Admin.updateMany({}, { $pull: { academicTerms: term._id } });

  res.status(200).json({
    status: "success",
    message: "academic term delete successfully",
  });
});
