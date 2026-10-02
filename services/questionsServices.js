const AysncHandler = require("express-async-handler");
const Exam = require("../models/Exam");
const Question = require("../models/Questions");
const ApiError = require("../utils/apiError");

const isOwner = (user, doc) => String(doc.createdBy) === String(user._id);

//@desc  Scope GET /questions by role (teacher => his questions only)
exports.setQuestionsFilter = (req, res, next) => {
  if (req.userAuth.role === "teacher") {
    req.filter = { createdBy: req.userAuth._id };
  }
  next();
};

//@desc  Create Question
//@route POST /api/v1/questions/:examID
//@acess Private  Teachers only
exports.createQuestion = AysncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  //find the exam
  const examFound = await Exam.findById(req.params.examID).populate(
    "questions",
    "question"
  );
  if (!examFound) {
    return next(new ApiError("Exam not found", 404));
  }
  if (!isOwner(req.userAuth, examFound)) {
    return next(new ApiError("You can only add questions to your exams", 403));
  }
  //check if the question already exists in this exam
  const questionExists = examFound.questions.some(
    (item) => item.question === question
  );
  if (questionExists) {
    return next(new ApiError("Question already exists in this exam", 400));
  }
  //create question
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.userAuth._id,
  });
  //add the question into exam
  await Exam.findByIdAndUpdate(examFound._id, {
    $push: { questions: questionCreated._id },
  });
  res.status(201).json({
    status: "success",
    message: "Question created",
    data: questionCreated,
  });
});

//@desc  get all questions
//@route GET /api/v1/questions
//@acess  Private - admin / teacher
exports.getQuestions = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc  get single Question
//@route GET /api/v1/questions/:id
//@acess  Private
exports.getQuestion = AysncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new ApiError("Question not found", 404));
  }
  if (req.userAuth.role !== "admin" && !isOwner(req.userAuth, question)) {
    return next(new ApiError("You are not allowed to view this question", 403));
  }
  res.status(200).json({
    status: "success",
    message: "Question fetched successfully",
    data: question,
  });
});

//@desc   Update  Question
//@route  PUT /api/v1/questions/:id
//@acess  Private Teacher only
exports.updatQuestion = AysncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  const questionFound = await Question.findById(req.params.id);
  if (!questionFound) {
    return next(new ApiError("Question not found", 404));
  }
  if (!isOwner(req.userAuth, questionFound)) {
    return next(new ApiError("You can only edit your questions", 403));
  }
  const updated = await Question.findByIdAndUpdate(
    req.params.id,
    { question, optionA, optionB, optionC, optionD, correctAnswer },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Question  updated successfully",
    data: updated,
  });
});

//@desc   Delete  Question (and remove it from its exam)
//@route  DELETE /api/v1/questions/:id
//@acess  Private Teacher only
exports.deleteQuestion = AysncHandler(async (req, res, next) => {
  const questionFound = await Question.findById(req.params.id);
  if (!questionFound) {
    return next(new ApiError("Question not found", 404));
  }
  if (!isOwner(req.userAuth, questionFound)) {
    return next(new ApiError("You can only delete your questions", 403));
  }
  await Exam.updateMany(
    { questions: questionFound._id },
    { $pull: { questions: questionFound._id } }
  );
  await questionFound.deleteOne();
  res.status(200).json({
    status: "success",
    message: "Question deleted successfully",
  });
});
