const express = require("express");
const { protect, allowedTo } = require("../middlewares/auth");
const { isTeacherLogin } = require("../middlewares/isTeacherLogin");
const isTeacher = require("../middlewares/isTeacher");
const advancedResults = require("../middlewares/advancedResults");
const Exam = require("../models/Exam");

const {
  createExam,
  getExams,
  getExam,
  updatExam,
  deleteExam,
  setExamsFilter,
} = require("../services/examsServices");

const router = express.Router();

const examPopulate = [
  { path: "subject", select: "name" },
  { path: "classLevel", select: "name" },
];

router
  .route("/")
  .post(isTeacherLogin, isTeacher, createExam)
  // admin => all exams, teacher => his exams, student => exams of his class
  .get(
    protect,
    allowedTo("admin", "teacher", "student"),
    setExamsFilter,
    advancedResults(Exam, examPopulate),
    getExams
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getExam)
  .put(isTeacherLogin, isTeacher, updatExam)
  .delete(protect, allowedTo("admin", "teacher"), deleteExam);

module.exports = router;
