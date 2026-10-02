const AysncHandler = require("express-async-handler");
const ExamResult = require("../models/ExamResults");
const Student = require("../models/Student");
const ApiError = require("../utils/apiError");

//@desc  Scope GET /exam-results by role (student => only his results)
exports.setExamResultsFilter = (req, res, next) => {
  if (req.userAuth.role === "student") {
    req.filter = { studentID: req.userAuth.studentId };
  }
  next();
};

//@desc  Exam results checking
//@route GET /api/v1/exam-results/:id/checking
//@acess  Private - Students only
exports.checkExamResults = AysncHandler(async (req, res, next) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    return next(new ApiError("student not found", 404));
  }
  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound.studentId,
    _id: req.params.id,
  })
    .populate({ path: "exam", select: "name subject passMark totalMark" })
    .populate({ path: "classLevel", select: "name" });
  if (!examResult) {
    return next(new ApiError("Exam result not found", 404));
  }
  //check if exam is published
  if (examResult.isPublished === false) {
    return next(
      new ApiError("Exam result is not available, check out later", 403)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
});

//@desc  Get all Exam results
//@route GET /api/v1/exam-results
//@acess  Private - admin (all) / student (his own)
exports.getAllExamResults = AysncHandler(async (req, res) => {
  const results = res.results;
  // a student must not see marks of a result that is not published yet
  if (req.userAuth.role === "student") {
    results.data = results.data.map((doc) => {
      const item = doc.toJSON();
      if (!item.isPublished) {
        delete item.score;
        delete item.grade;
        delete item.status;
        delete item.remarks;
        delete item.answeredQuestions;
      }
      return item;
    });
  }
  res.status(200).json(results);
});

//@desc  Admin publish / unpublish exam results
//@route PUT /api/v1/exam-results/:id/admin-toggle-publish
//@acess  Private - Admin only
exports.adminToggleExamResult = AysncHandler(async (req, res, next) => {
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    { isPublished: Boolean(req.body.publish) },
    { new: true }
  );
  if (!publishResult) {
    return next(new ApiError("Exam result not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Exam Results Updated",
    data: publishResult,
  });
});
