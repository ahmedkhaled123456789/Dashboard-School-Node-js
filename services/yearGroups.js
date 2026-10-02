const AysncHandler = require("express-async-handler");
const YearGroup = require("../models/YearGroup");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create year group
//@route POST /api/v1/year-Groups
//@acess  Private
exports.createYearGroup = AysncHandler(async (req, res, next) => {
  const { name, academicYear } = req.body;

  //check if exists
  const yeargroup = await YearGroup.findOne({ name });
  if (yeargroup) {
    return next(new ApiError("Year Group/Graduation already exists", 400));
  }
  //create
  const yearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });
  //push year group into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { yearGroups: yearGroup._id },
  });
  res.status(201).json({
    status: "success",
    message: "Year Group created successfully",
    data: yearGroup,
  });
});

//@desc  get all Year grups
//@route GET /api/v1/year-Groups
//@acess  Private
exports.getYearGroups = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single year group
//@route GET /api/v1/year-Groups/:id
//@acess  Private
exports.getYearGroup = AysncHandler(async (req, res, next) => {
  const group = await YearGroup.findById(req.params.id);
  if (!group) {
    return next(new ApiError("Year Group not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Year Group fetched successfully",
    data: group,
  });
});

//@desc   Update  Year Group
//@route  PUT /api/v1/year-Groups/:id
//@acess  Private
exports.updateYearGroup = AysncHandler(async (req, res, next) => {
  const { name, academicYear } = req.body;
  const { id } = req.params;
  //check if another group has the same name
  const yearGroupFound = await YearGroup.findOne({ name, _id: { $ne: id } });
  if (yearGroupFound) {
    return next(new ApiError("Year Group already exists", 400));
  }
  const yearGroup = await YearGroup.findByIdAndUpdate(
    id,
    { name, academicYear },
    { new: true, runValidators: true }
  );
  if (!yearGroup) {
    return next(new ApiError("Year Group not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Year Group  updated successfully",
    data: yearGroup,
  });
});

//@desc   Delete  Year group
//@route  DELETE /api/v1/year-Groups/:id
//@acess  Private
exports.deleteYearGroup = AysncHandler(async (req, res, next) => {
  const yearGroup = await YearGroup.findByIdAndDelete(req.params.id);
  if (!yearGroup) {
    return next(new ApiError("Year Group not found", 404));
  }
  await Admin.updateMany({}, { $pull: { yearGroups: yearGroup._id } });
  res.status(200).json({
    status: "success",
    message: "Year Group deleted successfully",
  });
});
