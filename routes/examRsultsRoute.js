const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isStudentLogin } = require("../middlewares/isStudentLogin");
const { isLogin } = require("../middlewares/isLogin");
const { protect, allowedTo } = require("../middlewares/auth");
const isStudent = require("../middlewares/isStudent");
const ExamResults = require("../models/ExamResults");
const advancedResults = require("../middlewares/advancedResults");
const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
  setExamResultsFilter,
} = require("../services/examResults");

const router = express.Router();
// admin => all results, student => only his own results
router
  .route("/")
  .get(
    protect,
    allowedTo("admin", "student"),
    setExamResultsFilter,
    advancedResults(ExamResults, { path: "exam", select: "name" }),
    getAllExamResults
  );

router
  .route("/:id/checking")
  .get(isStudentLogin, isStudent, checkExamResults)
  .put(isLogin, isAdmin, adminToggleExamResult);

router
  .route("/:id/admin-toggle-publish")
  .put(isLogin, isAdmin, adminToggleExamResult);

module.exports = router;
