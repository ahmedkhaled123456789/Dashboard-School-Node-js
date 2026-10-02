const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isStudentLogin } = require("../middlewares/isStudentLogin");
const { isLogin } = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const Student = require("../models/Student");
const advancedResults = require("../middlewares/advancedResults");

const {
  adminRegisterStudent,
  loginStudent,
  getStudentProfile,
  getAllStudentsByAdmin,
  getStudentByAdmin,
  studentUpdateProfile,
  adminUpdateStudent,
  getStudentExamPaper,
  writeExam,
  deleteStudent,
} = require("../services/studentsServices");

const router = express.Router();

router.route("/admins/register").post(isLogin, isAdmin, adminRegisterStudent);
router.route("/login").post(loginStudent);

router
  .route("/admin")
  .get(isLogin, isAdmin, advancedResults(Student), getAllStudentsByAdmin);
router.route("/profile").get(isStudentLogin, isStudent, getStudentProfile);

router.route("/update").put(isStudentLogin, isStudent, studentUpdateProfile);

router
  .route("/:studentID/update/admin")
  .put(isLogin, isAdmin, adminUpdateStudent);

router
  .route("/:studentID/admin")
  .get(isLogin, isAdmin, getStudentByAdmin)
  .delete(isLogin, isAdmin, deleteStudent);

// student-safe exam paper (questions without the correct answers)
router
  .route("/exam/:examID")
  .get(isStudentLogin, isStudent, getStudentExamPaper);

router
  .route("/exam/:examID/write")
  .post(isStudentLogin, isStudent, writeExam);

module.exports = router;
