const AysncHandler = require("express-async-handler");
const FeesGroup = require("../models/FeesGroup");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create FeesGroup
//@route POST /api/v1/feesGroup
//@acess  Private
exports.createFeesGroup = AysncHandler(async (req, res, next) => {
  const { name, description, feesType } = req.body;
  //check if exists
  const feesGroup = await FeesGroup.findOne({ name });
  if (feesGroup) {
    return next(new ApiError("FeesGroup already exists", 400));
  }
  //create
  const feesGroupCreated = await FeesGroup.create({
    name,
    description,
    feesType,
    createdBy: req.userAuth._id,
  });
  //push FeesGroup into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { feesgroup: feesGroupCreated._id },
  });

  res.status(201).json({
    status: "success",
    message: "Fees Group created successfully",
    data: feesGroupCreated,
  });
});

//@desc  get all FeesGroup
//@route GET /api/v1/feesGroup
//@acess  Private
exports.getAllFeesGroup = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single FeesGroup
//@route GET /api/v1/feesGroup/:id
//@acess  Private
exports.getFeesGroup = AysncHandler(async (req, res, next) => {
  const feesGroup = await FeesGroup.findById(req.params.id);
  if (!feesGroup) {
    return next(new ApiError("FeesGroup not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "FeesGroup fetched successfully",
    data: feesGroup,
  });
});

//@desc   Update  FeesGroup
//@route  PUT /api/v1/feesGroup/:id
//@acess  Private
exports.updateFeesGroup = AysncHandler(async (req, res, next) => {
  const { name, description, feesType } = req.body;
  const { id } = req.params;
  //check if another group has the same name
  const feesGroupFound = await FeesGroup.findOne({ name, _id: { $ne: id } });
  if (feesGroupFound) {
    return next(new ApiError("FeesGroup already exists", 400));
  }
  const feesGroup = await FeesGroup.findByIdAndUpdate(
    id,
    { name, description, feesType },
    { new: true, runValidators: true }
  );
  if (!feesGroup) {
    return next(new ApiError("FeesGroup not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "FeesGroup  updated successfully",
    data: feesGroup,
  });
});

//@desc   Delete  FeesGroup
//@route  DELETE /api/v1/feesGroup/:id
//@acess  Private
exports.deleteFeesGroup = AysncHandler(async (req, res, next) => {
  const feesGroup = await FeesGroup.findByIdAndDelete(req.params.id);
  if (!feesGroup) {
    return next(new ApiError("FeesGroup not found", 404));
  }
  await Admin.updateMany({}, { $pull: { feesgroup: feesGroup._id } });
  res.status(200).json({
    status: "success",
    message: "FeesGroup deleted successfully",
  });
});
