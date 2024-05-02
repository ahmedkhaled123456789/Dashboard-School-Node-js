const AysncHandler = require("express-async-handler");
const Exam = require(".././models/Exam");
const Teacher = require(".././models/Teacher");
const ApiError = require("../utils/apiError");

//@desc  Create Exam
//@route POST /api/v1/exams
//@acess Private  Teachers only

exports.createExam = AysncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    duration,
    examDate, 
    examTime,
    examType,
    createdBy,
    classLevel,
  } = req.body;
  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    return next(new ApiError("Teacher not found", 404));
  }
  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    return next(new ApiError("Exam already exists", 404));
  }
  //create
  const examCreated = new Exam({
    name,
    description,
    classLevel,
    createdBy,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    createdBy: req.userAuth?._id,
  });
  //push the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);
  //save exam
  await examCreated.save();
  await teacherFound.save();
  res.status(201).json({
    status: "success",
    message: "Exam created",
    data: examCreated,
  });
});

//@desc  get all Exams
//@route GET /api/v1/exams
//@acess  Private

exports.getExams = AysncHandler(async (req, res,next) => {
  const exams = await Exam.find().populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });
  res.status(201).json({
    status: "success",
    message: "Exam geted",
    data: exams,
  });
 });

//@desc  get single exam
//@route GET /api/v1/exams/:id
//@acess  Private Teahers only

exports.getExam = AysncHandler(async (req, res) => {
  const exams = await Exam.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Exam fetched successfully",
    data: exams,
  });
});

//@desc   Update  Exam
//@route  PUT /api/v1/exams/:id
//@acess  Private  - Teacher only

exports.updatExam = AysncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
     classLevel,
  } = req.body;
  //check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    return next(new ApiError("Exam already exists", 404));
  }

  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
        duration,
      examDate,
      examTime,
      examType,
      createdBy,
       classLevel,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Exam  updated successfully",
    data: examUpdated,
  });
});
