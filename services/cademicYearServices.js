const asyncHandler = require("express-async-handler");
const AcademicYear = require("../models/AcademicYear");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

exports.createAcademincYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear } = req.body;
  // check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    return next(new ApiError("academic year already exists", 404));
  }
  //craete

  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth._id,
  });
// push academic year into admin
const admin= await Admin.findById(req.userAuth._id);
admin.academicYears.push(academicYearCreated._id)
await admin.save();
  res.status(201).json({
    status: "success",
    message: "academic year created successfully",
    data: academicYearCreated,
  });
});

exports.getAcademincYears = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.results);

});

exports.getAcademincYear = asyncHandler(async (req, res, next) => {
  
  const id = req.params.id;

  const academic = await AcademicYear.findById(id);

  res.status(201).json({
    status: "success",
    message: "academic year fetched successfully",
    data: academic,
  });
});

exports.updateAcademincYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear } = req.body;
  // check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    return next(new ApiError("academic year already exists", 404));
  }
  const id = req.params.id;
  const academic = await AcademicYear.findByIdAndUpdate(
    id,
    {
      name,
      fromYear,
      toYear,
      createdBy: req.userAuth._id,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "academic year update successfully",
    data: academic,
  });
});


exports.deleteAcademincYear = asyncHandler(async (req, res, next) => {
  
  const id = req.params.id;

  const academic = await AcademicYear.findByIdAndDelete(id);

  res.status(201).json({
    status: "success",
    message: "academic year delete successfully",
    
  });
});
