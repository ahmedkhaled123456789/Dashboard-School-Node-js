const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isTeacherLogin } = require("../middlewares/isTeacherLogin");
const { isLogin } = require("../middlewares/isLogin");
const isTeacher = require("../middlewares/isTeacher");
 const advancedResults = require("../middlewares/advancedResults");
 const Exam = require("../models/Exam");

const {
  createExam, 
    getExams,
    getExam, 
    updatExam,
} = require("../services/examsServices");

const router = express.Router();
router.route("/").post(isTeacherLogin, isTeacher, createExam)
  .get(isTeacherLogin, isTeacher, advancedResults(Exam, {
    path: "questions",
    populate: {
      path: "createdBy",
    }}), getExams);

router.route("/:id")
  .get(isTeacherLogin, isTeacher, getExam)
  .put(isTeacherLogin, isTeacher, updatExam);
 

 

module.exports = router;



 