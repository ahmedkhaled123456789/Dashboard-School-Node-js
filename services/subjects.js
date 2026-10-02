const AysncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const Subject = require("../models/Subject");
const ApiError = require("../utils/apiError");

//@desc  Create subject
//@route POST /api/v1/subjects
//@acess  Private
exports.createSubject = AysncHandler(async (req, res, next) => {
  const { name, day, classes, teacher, academicTerm } = req.body;
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    return next(new ApiError("Subject already exists", 400));
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    day,
    classes,
    teacher: teacher || undefined,
    academicTerm: academicTerm || undefined,
    createdBy: req.userAuth._id,
  });
  //push subject into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { subject: subjectCreated._id },
  });
  res.status(201).json({
    status: "success",
    message: "Subject created successfully",
    data: subjectCreated,
  });
});

//@desc  get all Subjects
//@route GET /api/v1/subjects
//@acess  Private
exports.getSubjects = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single subject
//@route GET /api/v1/subjects/:id
//@acess  Private
exports.getSubject = AysncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return next(new ApiError("Subject not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subject,
  });
});

//@desc   Update  Subject
//@route  PUT /api/v1/subjects/:id
//@acess  Private
exports.updatSubject = AysncHandler(async (req, res, next) => {
  const { name, day, classes, teacher, academicTerm } = req.body;
  const { id } = req.params;
  //check if another subject has the same name
  const subjectFound = await Subject.findOne({ name, _id: { $ne: id } });
  if (subjectFound) {
    return next(new ApiError("Subject already exists", 400));
  }
  const subject = await Subject.findByIdAndUpdate(
    id,
    {
      name,
      day,
      classes,
      teacher: teacher || undefined,
      academicTerm: academicTerm || undefined,
    },
    { new: true, runValidators: true }
  );
  if (!subject) {
    return next(new ApiError("Subject not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "subject  updated successfully",
    data: subject,
  });
});

//@desc   Delete  Subject
//@route  DELETE /api/v1/subjects/:id
//@acess  Private
exports.deleteSubject = AysncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    return next(new ApiError("Subject not found", 404));
  }
  await Admin.updateMany({}, { $pull: { subject: subject._id } });
  res.status(200).json({
    status: "success",
    message: "subject deleted successfully",
  });
});
