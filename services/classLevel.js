const AysncHandler = require("express-async-handler");
const ClassLevel = require("../models/ClassLevel");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create Class Level
//@route POST /api/v1/class-Level
//@acess  Private
exports.createClassLevel = AysncHandler(async (req, res, next) => {
  const { name, description, amount } = req.body;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new ApiError("class already exists", 400));
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    amount,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { classLevels: classCreated._id },
  });

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: classCreated,
  });
});

//@desc  get all class levels
//@route GET /api/v1/class-Level
//@acess  Private
exports.getClassLevels = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single Class level
//@route GET /api/v1/class-Level/:id
//@acess  Private
exports.getClassLevel = AysncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  if (!classLevel) {
    return next(new ApiError("Class not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Class fetched successfully",
    data: classLevel,
  });
});

//@desc   Update  Class Level
//@route  PUT /api/v1/class-Level/:id
//@acess  Private
exports.updateclassLevel = AysncHandler(async (req, res, next) => {
  const { name, description, amount } = req.body;
  const { id } = req.params;
  //check if another class has the same name
  const classFound = await ClassLevel.findOne({ name, _id: { $ne: id } });
  if (classFound) {
    return next(new ApiError("Class already exists", 400));
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
    id,
    { name, description, amount },
    { new: true, runValidators: true }
  );
  if (!classLevel) {
    return next(new ApiError("Class not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Class  updated successfully",
    data: classLevel,
  });
});

//@desc   Delete  class level
//@route  DELETE /api/v1/class-Level/:id
//@acess  Private
exports.deleteClassLevel = AysncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);
  if (!classLevel) {
    return next(new ApiError("Class not found", 404));
  }
  await Admin.updateMany({}, { $pull: { classLevels: classLevel._id } });
  res.status(200).json({
    status: "success",
    message: "Class level deleted successfully",
  });
});
