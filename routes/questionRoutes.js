const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isTeacherLogin } = require("../middlewares/isTeacherLogin");
const { isLogin } = require("../middlewares/isLogin");
const isTeacher = require("../middlewares/isTeacher");
const Questions = require("../models/Questions");
const advancedResults = require("../middlewares/advancedResults");
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updatQuestion,
} = require("../services/questionsServices");

const router = express.Router();
router.route("/").get(isTeacherLogin, isTeacher,advancedResults(Questions), getQuestions);
router.route("/:examID").post(isTeacherLogin, isTeacher, createQuestion);
router
  .route("/:id")
  .get(isTeacherLogin, isTeacher, getQuestion)
  .put(isTeacherLogin, isTeacher, updatQuestion);

module.exports = router;
 