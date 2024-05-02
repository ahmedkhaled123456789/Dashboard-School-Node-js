const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isTeacherLogin } = require("../middlewares/isTeacherLogin");
const { isLogin } = require("../middlewares/isLogin");
const isTeacher = require("../middlewares/isTeacher");
const advancedResults = require("../middlewares/advancedResults");
const Teacher = require("../models/Teacher");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacher,
  deleteTeacher,
} = require("../services/teachersServices");

const router = express.Router();
router.route("/admins/register").post(isLogin, isAdmin, adminRegisterTeacher);

router.route("/login").post(loginTeacher);

router.route("/admin").get(
  isLogin,
  isAdmin,
  advancedResults(Teacher
  //   , {
  //   path: "examsCreated", 
  //   populate: {
  //     path: "questions",
  //   },
  // }
),
  getAllTeachersAdmin
);
router.route("/:teacherID/admin").get(isLogin, isAdmin, getTeacherByAdmin);
router.route("/profile").get(isTeacherLogin, isTeacher, getTeacherProfile);

router
  .route("/:teacherID/update")
  .put(isTeacherLogin, isTeacher, teacherUpdateProfile);

router.route("/:teacherID/admin").put(isLogin, isAdmin, adminUpdateTeacher)
.delete(deleteTeacher);

module.exports = router;
 