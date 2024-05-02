const AysncHandler = require("express-async-handler");
const ClassLevel = require(".././models/ClassLevel");
const Admin = require(".././models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create Class Level
//@route POST /api/v1/class-levels
//@acess  Private
exports.createClassLevel = AysncHandler(async (req, res) => {
  const { name, description, amount } = req.body;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new ApiError("class already exists", 404));
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    amount,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: classCreated,
  });
});

//@desc  get all class levels
//@route GET /api/v1/class-levels
//@acess  Private
exports.getClassLevels = AysncHandler(async (req, res, next) => {
  
  console.log(req.params)
  res.status(200).json(res.results);


});

//@desc  get single Class level
//@route GET /api/v1/class-levels/:id
//@acess  Private
exports.getClassLevel = AysncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Class fetched successfully",
    data: classLevel,
  });
});

//@desc   Update  Class Level
//@route  PUT /api/v1/class-levels/:id
//@acess  Private

exports.updateclassLevel = AysncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new ApiError("Class already exists", 404));
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      amount,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Class  updated successfully",
    data: classLevel,
  });
});

//@desc   Delete  class level
//@route  PUT /api/v1/aclass-levels/:id
//@acess  Private
exports.deleteClassLevel = AysncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully",
  });
});
