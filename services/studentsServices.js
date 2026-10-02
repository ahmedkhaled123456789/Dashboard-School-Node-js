const AysncHandler = require("express-async-handler");
const Student = require("../models/Student");
const Exam = require("../models/Exam");
const ExamResult = require("../models/ExamResults");
const ClassLevel = require("../models/ClassLevel");
const Admin = require("../models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const { validateImage, normalizeImage } = require("../utils/userImage");

const OPTION_KEYS = ["A", "B", "C", "D"];

// class level ids of a student (classLevels are auto populated by the model)
const studentClassIds = (student) =>
  (student?.classLevels || []).map((level) => String(level?._id || level));

//@desc  Admin Register Student
//@route POST /api/v1/students/admins/register
//@acess  Private Admin only
exports.adminRegisterStudent = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    admissionDate,
    phone,
    address,
    gender,
    fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    religion,
    status,
    classLevels,
    fatherEmail,
    image,
  } = req.body;
  if (image !== undefined) {
    const imageError = validateImage(image);
    if (imageError) {
      return next(new ApiError(imageError, 400));
    }
  }
  if (!password) {
    return next(new ApiError("Password is required", 400));
  }
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    return next(new ApiError("Admin not found", 404));
  }
  //check if student already exists
  const student = await Student.findOne({ email });
  if (student) {
    return next(new ApiError("Student already exists", 400));
  }
  // create
  const studentRegistered = await Student.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    admissionDate,
    phone,
    address,
    gender,
    fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    religion,
    status,
    classLevels,
    fatherEmail,
    image: image ? normalizeImage(image) : undefined,
  });
  //push student into admin and his class levels
  await Admin.findByIdAndUpdate(adminFound._id, {
    $push: { students: studentRegistered._id },
  });
  if (Array.isArray(classLevels) && classLevels.length) {
    await ClassLevel.updateMany(
      { _id: { $in: classLevels } },
      { $addToSet: { students: studentRegistered._id } }
    );
  }
  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentRegistered,
  });
});

//@desc    login  student
//@route   POST /api/v1/students/login
//@access  Public
exports.loginStudent = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //find the  user
  const student = await Student.findOne({ email });
  if (!student || !(await bcrypt.compare(password || "", student.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  if (student.isWithdrawn) {
    return next(new ApiError("Your account has been withdrawn", 403));
  }
  res.status(200).json({
    status: "success",
    message: "Student logged in successfully",
    token: createToken(student._id),
    data: student,
  });
});

//@desc    Student Profile
//@route   GET /api/v1/students/profile
//@access  Private Student only
exports.getStudentProfile = AysncHandler(async (req, res, next) => {
  const student = await Student.findById(req.userAuth?._id)
    .select("-password")
    .populate("program", "name")
    .populate("academicYear", "name")
    .populate("examResults");
  if (!student) {
    return next(new ApiError("Student not found", 404));
  }
  //current class level name (last class level)
  const levels = student.classLevels || [];
  const lastLevel = levels[levels.length - 1];

  //current exam result, only if it is published
  const examResults = student.examResults || [];
  const lastResult = examResults[examResults.length - 1];

  res.status(200).json({
    status: "success",
    data: {
      ...student.toJSON(),
      currentClassLevel: lastLevel?.name || student.currentClassLevel,
      currentExamResult: lastResult?.isPublished ? lastResult : null,
    },
    message: "Student Profile fetched  successfully",
  });
});

//@desc    Get all Students
//@route   GET /api/v1/students/admin
//@access  Private admin only
exports.getAllStudentsByAdmin = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc    Get Single Student
//@route   GET /api/v1/students/:studentID/admin
//@access  Private admin only
exports.getStudentByAdmin = AysncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.studentID);
  if (!student) {
    return next(new ApiError("Student not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

//@desc    Student updating profile
//@route   PUT /api/v1/students/update
//@access  Private Student only
exports.studentUpdateProfile = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const studentId = req.userAuth._id;
  //if email is taken by another student
  if (email) {
    const emailExist = await Student.findOne({
      email,
      _id: { $ne: studentId },
    });
    if (emailExist) {
      return next(new ApiError("This email is taken/exist", 400));
    }
  }

  const update = { email };
  //check if user is updating password
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }

  const student = await Student.findByIdAndUpdate(studentId, update, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: student,
    message: "Student updated successfully",
  });
});

//@desc     Admin updating Students eg: Assigning classes....
//@route    PUT /api/v1/students/:studentID/update/admin
//@access   Private Admin only
exports.adminUpdateStudent = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    admissionDate,
    phone,
    address,
    gender,
    fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    fatherEmail,
    religion,
    status,
    classLevels,
    academicYear,
    program,
    prefectName,
    isSuspended,
    isWithdrawn,
    isGraduated,
    image,
  } = req.body;
  const { studentID } = req.params;
  if (image !== undefined) {
    const imageError = validateImage(image);
    if (imageError) {
      return next(new ApiError(imageError, 400));
    }
  }

  //find the student by id
  const studentFound = await Student.findById(studentID);
  if (!studentFound) {
    return next(new ApiError("Student not found", 404));
  }
  //if email is taken by another student
  if (email) {
    const emailExist = await Student.findOne({ email, _id: { $ne: studentID } });
    if (emailExist) {
      return next(new ApiError("This email is taken/exist", 400));
    }
  }

  const update = {
    name,
    email,
    admissionDate,
    phone,
    address,
    gender,
    fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    fatherEmail,
    religion,
    status,
    classLevels,
    academicYear: academicYear || undefined,
    program: program || undefined,
    prefectName,
    isSuspended,
    isWithdrawn,
    isGraduated,
  };
  if (image !== undefined) {
    update.image = normalizeImage(image);
  }
  //never store a plain text password
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    studentID,
    { $set: update },
    { new: true, runValidators: true }
  );
  if (Array.isArray(classLevels) && classLevels.length) {
    await ClassLevel.updateMany(
      { _id: { $in: classLevels } },
      { $addToSet: { students: studentUpdated._id } }
    );
  }
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated successfully",
  });
});

//@desc     Student-safe exam paper (no correct answers)
//@route    GET /api/v1/students/exam/:examID
//@access   Private Students only
exports.getStudentExamPaper = AysncHandler(async (req, res, next) => {
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    return next(new ApiError("Student not found", 404));
  }
  const examFound = await Exam.findById(req.params.examID)
    .populate("subject", "name")
    .populate("classLevel", "name")
    .populate("questions", "question optionA optionB optionC optionD");
  if (!examFound) {
    return next(new ApiError("Exam not found", 404));
  }
  if (examFound.examStatus !== "live") {
    return next(new ApiError("This exam is not live yet", 400));
  }
  //student must belong to the exam class level (when he has one)
  const classIds = studentClassIds(studentFound);
  const examClass = String(examFound.classLevel?._id || examFound.classLevel);
  if (classIds.length && !classIds.includes(examClass)) {
    return next(new ApiError("This exam is not for your class", 403));
  }
  //already written?
  const written = await ExamResult.findOne({
    studentID: studentFound.studentId,
    exam: examFound._id,
  });
  if (written) {
    return next(new ApiError("You have already written this exam", 400));
  }

  const exam = examFound.toJSON();
  const questions = exam.questions || [];
  exam.questions = questions.map((question) => question._id);

  res.status(200).json({
    status: "success",
    message: "Exam paper fetched successfully",
    data: { exam, questions },
  });
});

//@desc     Student taking Exams
//@route    POST /api/v1/students/exam/:examID/write
//@access   Private Students only
exports.writeExam = AysncHandler(async (req, res, next) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    return next(new ApiError("Student not found", 404));
  }
  if (studentFound.isSuspended || studentFound.isWithdrawn) {
    return next(new ApiError("Your account cannot write exams", 403));
  }
  //Get exam
  const examFound = await Exam.findById(req.params.examID).populate(
    "questions"
  );
  if (!examFound) {
    return next(new ApiError("Exam not found", 404));
  }
  if (examFound.examStatus !== "live") {
    return next(new ApiError("This exam is not live yet", 400));
  }
  const classIds = studentClassIds(studentFound);
  if (classIds.length && !classIds.includes(String(examFound.classLevel))) {
    return next(new ApiError("This exam is not for your class", 403));
  }

  //get questions
  const questions = examFound.questions || [];
  if (questions.length === 0) {
    return next(new ApiError("This exam has no questions", 400));
  }
  //get students questions answers
  const studentAnswers = req.body.answers;
  //check if student answered all questions
  if (
    !Array.isArray(studentAnswers) ||
    studentAnswers.length !== questions.length ||
    studentAnswers.some((answer) => !answer)
  ) {
    return next(new ApiError("You have not answered all the questions", 400));
  }

  // check if student has already taken the exam
  const studentFoundInResults = await ExamResult.findOne({
    studentID: studentFound.studentId,
    exam: examFound._id,
  });
  if (studentFoundInResults) {
    return next(new ApiError("You have already written this exam", 400));
  }

  //check for answers
  // the answer can be the option key (A/B/C/D) or the option text
  let correctAnswers = 0;
  const answeredQuestions = questions.map((question, i) => {
    const answer = String(studentAnswers[i]).trim();
    const answerText = OPTION_KEYS.includes(answer.toUpperCase())
      ? question[`option${answer.toUpperCase()}`]
      : answer;
    const correct = String(question.correctAnswer).trim();
    const isCorrect = answer === correct || answerText === correct;
    if (isCorrect) correctAnswers += 1;
    return {
      question: question.question,
      studentAnswer: answerText,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };
  });

  //calculate reports
  const score = correctAnswers;
  const grade = Math.round((correctAnswers / questions.length) * 100);
  const passMark = examFound.passMark ?? 50;
  const status = grade >= passMark ? "Pass" : "Fail";

  //Remarks
  let remarks;
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam results
  const examResults = await ExamResult.create({
    studentID: studentFound.studentId,
    exam: examFound._id,
    grade,
    score,
    passMark,
    status,
    remarks,
    classLevel: examFound.classLevel,
    answeredQuestions,
  });
  //push the results into the student
  await Student.findByIdAndUpdate(studentFound._id, {
    $push: { examResults: examResults._id },
  });

  res.status(200).json({
    status: "success",
    data: "You have submitted your exam. Check later for the results",
  });
});

//@desc   Delete  student
//@route  DELETE /api/v1/students/:studentID/admin
//@acess  Private admin only
exports.deleteStudent = AysncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.studentID);
  if (!student) {
    return next(new ApiError("Student not found", 404));
  }
  await Admin.updateMany({}, { $pull: { students: student._id } });
  await ClassLevel.updateMany({}, { $pull: { students: student._id } });
  res.status(200).json({
    status: "success",
    message: "Student deleted successfully",
  });
});
