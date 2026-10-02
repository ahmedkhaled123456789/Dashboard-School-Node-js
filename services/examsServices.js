const AysncHandler = require("express-async-handler");
const Exam = require("../models/Exam");
const Question = require("../models/Questions");
const Teacher = require("../models/Teacher");
const ApiError = require("../utils/apiError");

// fields a teacher can set on an exam
const examFields = (body) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    passMark,
    totalMark,
  } = body;
  return {
    name,
    description,
    subject,
    program: program || undefined,
    academicTerm: academicTerm || undefined,
    academicYear: academicYear || undefined,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    examStatus,
    passMark,
    totalMark,
  };
};

// a teacher can only manage his own exams, admin can manage all
const canManage = (user, exam) =>
  user.role === "admin" || String(exam.createdBy) === String(user._id);

//@desc  Scope GET /exams by role
// admin => all, teacher => his exams, student => exams of his class levels
exports.setExamsFilter = (req, res, next) => {
  const user = req.userAuth;
  if (user.role === "teacher") {
    req.filter = { createdBy: user._id };
  } else if (user.role === "student") {
    const classIds = (user.classLevels || []).map((c) => c?._id || c);
    req.filter = classIds.length ? { classLevel: { $in: classIds } } : {};
  }
  next();
};

//@desc  Create Exam
//@route POST /api/v1/exams
//@acess Private  Teachers only
exports.createExam = AysncHandler(async (req, res, next) => {
  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    return next(new ApiError("Teacher not found", 404));
  }
  //exam exists
  const examExists = await Exam.findOne({ name: req.body.name });
  if (examExists) {
    return next(new ApiError("Exam already exists", 400));
  }
  //create
  const examCreated = await Exam.create({
    ...examFields(req.body),
    examStatus: "pending",
    createdBy: teacherFound._id,
  });
  //push the exam into teacher
  await Teacher.findByIdAndUpdate(teacherFound._id, {
    $push: { examsCreated: examCreated._id },
  });
  res.status(201).json({
    status: "success",
    message: "Exam created",
    data: examCreated,
  });
});

//@desc  get all Exams
//@route GET /api/v1/exams
//@acess  Private
exports.getExams = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single exam
//@route GET /api/v1/exams/:id
//@acess  Private admin / owner teacher
exports.getExam = AysncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    return next(new ApiError("Exam not found", 404));
  }
  if (!canManage(req.userAuth, exam)) {
    return next(new ApiError("You are not allowed to view this exam", 403));
  }
  res.status(200).json({
    status: "success",
    message: "Exam fetched successfully",
    data: exam,
  });
});

//@desc   Update  Exam (also used to set examStatus pending/live)
//@route  PUT /api/v1/exams/:id
//@acess  Private  - Teacher only
exports.updatExam = AysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new ApiError("Exam not found", 404));
  }
  if (!canManage(req.userAuth, exam)) {
    return next(new ApiError("You are not allowed to edit this exam", 403));
  }
  //check if another exam has the same name
  if (req.body.name) {
    const examFound = await Exam.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });
    if (examFound) {
      return next(new ApiError("Exam already exists", 400));
    }
  }
  //an exam can't go live without questions
  if (req.body.examStatus === "live" && exam.questions.length === 0) {
    return next(new ApiError("Add questions before making the exam live", 400));
  }

  const examUpdated = await Exam.findByIdAndUpdate(id, examFields(req.body), {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Exam  updated successfully",
    data: examUpdated,
  });
});

//@desc   Delete  Exam and its questions
//@route  DELETE /api/v1/exams/:id
//@acess  Private  admin / owner teacher
exports.deleteExam = AysncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    return next(new ApiError("Exam not found", 404));
  }
  if (!canManage(req.userAuth, exam)) {
    return next(new ApiError("You are not allowed to delete this exam", 403));
  }
  await Question.deleteMany({ _id: { $in: exam.questions } });
  await Teacher.updateMany({}, { $pull: { examsCreated: exam._id } });
  await exam.deleteOne();
  res.status(200).json({
    status: "success",
    message: "Exam deleted successfully",
  });
});
