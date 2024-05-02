const AysncHandler = require("express-async-handler");
const Admin = require(".././models/Admin");
const Subject = require("../models/Subject");
const ApiError = require("../utils/apiError");

//@desc  Create subject
//@route POST /api/v1/subjects
//@acess  Private

exports.createSubject = AysncHandler(async (req, res, next) => {
  const { name, day, classes, teacher } = req.body;
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    return next(new ApiError(" Subject  already exists", 404));
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    day,
    classes,
    teacher,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.subject.push(subjectCreated._id);
  //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Subject created successfully",
    data: subjectCreated,
  });
});

//@desc  get all Subjects
//@route GET /api/v1/subjects
//@acess  Private

exports.getSubjects = AysncHandler(async (req, res, next) => {
  res.status(200).json(res.results);
});

//@desc  get single subject
//@route GET /api/v1/subjects/:id
//@acess  Private
exports.getSubject = AysncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subject,
  });
});

//@desc   Update  Subject
//@route  PUT /api/v1/subjects/:id
//@acess  Private

exports.updatSubject = AysncHandler(async (req, res, next) => {
  const { name, description, academicTerm } = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    return next(new ApiError(" Program already exists", 404));
  }
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      day,
    classes,
    teacher,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "subject  updated successfully",
    data: subject,
  });
});

//@desc   Delete  Subject
//@route  PUT /api/v1/subjects/:id
//@acess  Private
exports.deleteSubject = AysncHandler(async (req, res, next) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "subject deleted successfully",
  });
});
