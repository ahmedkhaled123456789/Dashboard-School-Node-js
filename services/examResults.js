const AysncHandler = require("express-async-handler");
const ExamResult = require(".././models/ExamResults");
const Student = require(".././models/Student");
const ApiError = require("../utils/apiError");
//@desc  Exam results checking
//@route POST /api/v1/exam-results/:id/checking
//@acess  Private - Students only

exports.checkExamResults = AysncHandler(async (req, res,next) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
     return next(new ApiError("student not found", 404));
 
  }
  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");
  //check if exam is published
  if (examResult?.isPublished === false) {
    return next(new ApiError("Exam result is not available, check out later", 404));

   }
  res.json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
});

//@desc  Get all Exam results (name, id)
//@route POST /api/v1/exam-results
//@acess  Private - Students only

exports.getAllExamResults = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);

});

//@desc  Admin publish exam results
//@route PUT /api/v1/exam-results/:id/admin-toggle-publish
//@acess  Private - Admin only

exports.adminToggleExamResult = AysncHandler(async (req, res) => {
  //find the exam Results
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    return next(new ApiError("Exam result not found", 404));

   }
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Exam Results Updated",
    data: publishResult,
  });
});
