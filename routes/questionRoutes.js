const express = require("express");
const { protect, allowedTo } = require("../middlewares/auth");
const { isTeacherLogin } = require("../middlewares/isTeacherLogin");
const isTeacher = require("../middlewares/isTeacher");
const Questions = require("../models/Questions");
const advancedResults = require("../middlewares/advancedResults");
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updatQuestion,
  deleteQuestion,
  setQuestionsFilter,
} = require("../services/questionsServices");

const router = express.Router();
// admin => all questions, teacher => his questions
router
  .route("/")
  .get(
    protect,
    allowedTo("admin", "teacher"),
    setQuestionsFilter,
    advancedResults(Questions),
    getQuestions
  );
router.route("/:examID").post(isTeacherLogin, isTeacher, createQuestion);
router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getQuestion)
  .put(isTeacherLogin, isTeacher, updatQuestion)
  .delete(isTeacherLogin, isTeacher, deleteQuestion);

module.exports = router;
