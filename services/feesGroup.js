const AysncHandler = require("express-async-handler");
const FeesGroup = require("../models/FeesGroup");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create FeesGroup
//@route POST /api/v1/FeesGroup 
//@acess  Private
exports.createFeesGroup = AysncHandler(async (req, res,next) => {
  const { name, description, feesType } = req.body;
  //check if exists
  const feesGroup = await FeesGroup.findOne({ name });
  if (feesGroup) { 
    return next(new ApiError("FeesGroup already exists", 404));
  }
  //create
  const feesGroupCreated = await FeesGroup.create({
    name,
    description,
    feesType,
    createdBy: req.userAuth._id,
  });
  //push FeesGroup into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.feesgroup.push(feesGroupCreated._id);
  //save
  await admin.save();
 
  res.status(201).json({
    status: "success",
    message: "Fees Group successfully",
    data: feesGroupCreated,
  });
});

//@desc  get all FeesGroup
//@route GET /api/v1/FeesGroup
//@acess  Private
exports.getAllFeesGroup = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);

});

//@desc  get single FeesGroup
//@route GET /api/v1/FeesGroup/:id
//@acess  Private
exports.getFeesGroup = AysncHandler(async (req, res) => {
  const feesGroup = await FeesGroup.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "FeesGroup fetched successfully",
    data: feesGroup,
  });
});

//@desc   Update  FeesGroup
//@route  PUT /api/v1/FeesGroup/:id
//@acess  Private

exports.updateFeesGroup = AysncHandler(async (req, res,next) => {
  const { name, description,feesType } = req.body;
  //check name exists
  const feesGroupFound = await FeesGroup.findOne({ name });
  if (feesGroupFound) {
     return next(new ApiError("FeesGroup already exists", 404));

  }
  const feesGroup = await FeesGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      feesType,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "FeesGroup  updated successfully",
    data: feesGroup,
  });
});

//@desc   Delete  FeesGroup
//@route  PUT /api/v1/FeesGroup/:id
//@acess  Private
exports.deleteFeesGroup = AysncHandler(async (req, res) => {
  await FeesGroup.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "FeesGroup deleted successfully",
  });
});
