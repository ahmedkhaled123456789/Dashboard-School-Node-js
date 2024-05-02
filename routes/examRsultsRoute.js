const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isStudentLogin } = require("../middlewares/isStudentLogin");
const { isLogin } = require("../middlewares/isLogin");
const isStudent = require("../middlewares/isStudent");
const ExamResults = require("../models/ExamResults");
const advancedResults = require("../middlewares/advancedResults");
const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
} = require("../services/examResults"); 

const router = express.Router();
router.route("/").get(isStudentLogin, isStudent,advancedResults(ExamResults), getAllExamResults);

router
  .route("/:id/checking")
  .get(isStudentLogin, isStudent, checkExamResults)
  .put(isLogin, isAdmin, adminToggleExamResult);


  router.route("/:id/admin-toggle-publish")
   .put(isLogin, isAdmin, adminToggleExamResult);
module.exports = router;
 