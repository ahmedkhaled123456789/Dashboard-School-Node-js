const AysncHandler = require("express-async-handler");
const Program = require("../models/Program");
const Subject = require("../models/Subject");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create Program
//@route POST /api/v1/program
//@acess  Private
exports.createProgram = AysncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  //check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    return next(new ApiError("program already exists", 400));
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });
  //push program into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { programs: programCreated._id },
  });

  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
});

//@desc  get all Programs
//@route GET /api/v1/program
//@acess  Private
exports.getPrograms = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single Program
//@route GET /api/v1/program/:id
//@acess  Private
exports.getProgram = AysncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Program fetched successfully",
    data: program,
  });
});

//@desc   Update  Program
//@route  PUT /api/v1/program/:id
//@acess  Private
exports.updatProgram = AysncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  const { id } = req.params;
  //check if another program has the same name
  const programFound = await Program.findOne({ name, _id: { $ne: id } });
  if (programFound) {
    return next(new ApiError("Program already exists", 400));
  }
  const program = await Program.findByIdAndUpdate(
    id,
    { name, description, duration },
    { new: true, runValidators: true }
  );
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Program  updated successfully",
    data: program,
  });
});

//@desc   Delete  Program
//@route  DELETE /api/v1/program/:id
//@acess  Private
exports.deleteProgram = AysncHandler(async (req, res, next) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }
  await Admin.updateMany({}, { $pull: { programs: program._id } });
  res.status(200).json({
    status: "success",
    message: "Program deleted successfully",
  });
});

//@desc   Add subject to Program
//@route  PUT /api/v1/program/:id/subjects
//@acess  Private
exports.addSubjectToProgram = AysncHandler(async (req, res, next) => {
  const { name } = req.body;
  //get the program
  const program = await Program.findById(req.params.id);
  if (!program) {
    return next(new ApiError("Program not found", 404));
  }
  //Find the subject
  const subjectFound = await Subject.findOne({ name });
  if (!subjectFound) {
    return next(new ApiError("Subject not found", 404));
  }
  //Check if subject exists
  const subjectExists = program.subjects?.find(
    (sub) => sub?.toString() === subjectFound?._id.toString()
  );
  if (subjectExists) {
    return next(new ApiError("Subject already exists", 400));
  }
  //push the subj into program
  program.subjects.push(subjectFound?._id);
  //save
  await program.save();
  res.status(200).json({
    status: "success",
    message: "Subject added successfully",
    data: program,
  });
});
