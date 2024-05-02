const asyncHandler = require("express-async-handler");
const AcademicTerm = require("../models/AcademicTerm");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

exports.createAcademincTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  // check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    return next(new ApiError("academic year already exists", 404));
  }
  //craete

  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });
  // push academic year into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "academic term created successfully",
    data: academicTermCreated,
  });
});

exports.getAcademincTerms = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.results);

});

exports.getAcademincTerm = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const term = await AcademicTerm.findById(id);

  res.status(201).json({
    status: "success",
    message: "academic term fetched successfully",
    data: term,
  });
});

exports.updateAcademincTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  // check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    return next(new ApiError("academic term already exists", 404));
  }
  const id = req.params.id;
  const term = await AcademicTerm.findByIdAndUpdate(
    id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth._id,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "academic term update successfully",
    data: term,
  });
});

exports.deleteAcademincTerm = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const term = await AcademicTerm.findByIdAndDelete(id);

  res.status(201).json({
    status: "success",
    message: "academic term delete successfully",
  });
});
