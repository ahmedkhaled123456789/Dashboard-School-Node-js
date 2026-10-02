const asyncHandler = require("express-async-handler");
const AcademicYear = require("../models/AcademicYear");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

exports.createAcademincYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear, isCurrent } = req.body;
  // check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    return next(new ApiError("academic year already exists", 400));
  }
  //craete
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    isCurrent,
    createdBy: req.userAuth._id,
  });
  // push academic year into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { academicYears: academicYearCreated._id },
  });
  res.status(201).json({
    status: "success",
    message: "academic year created successfully",
    data: academicYearCreated,
  });
});

exports.getAcademincYears = asyncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

exports.getAcademincYear = asyncHandler(async (req, res, next) => {
  const academic = await AcademicYear.findById(req.params.id);
  if (!academic) {
    return next(new ApiError("academic year not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "academic year fetched successfully",
    data: academic,
  });
});

exports.updateAcademincYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear, isCurrent } = req.body;
  const { id } = req.params;
  // check if another year has the same name
  const academicYear = await AcademicYear.findOne({ name, _id: { $ne: id } });
  if (academicYear) {
    return next(new ApiError("academic year already exists", 400));
  }
  const academic = await AcademicYear.findByIdAndUpdate(
    id,
    { name, fromYear, toYear, isCurrent },
    { new: true, runValidators: true }
  );
  if (!academic) {
    return next(new ApiError("academic year not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "academic year update successfully",
    data: academic,
  });
});

exports.deleteAcademincYear = asyncHandler(async (req, res, next) => {
  const academic = await AcademicYear.findByIdAndDelete(req.params.id);
  if (!academic) {
    return next(new ApiError("academic year not found", 404));
  }
  await Admin.updateMany({}, { $pull: { academicYears: academic._id } });

  res.status(200).json({
    status: "success",
    message: "academic year delete successfully",
  });
});
