const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const AcademicYear = require("../models/AcademicYear");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const { protect, allowedTo } = require("../middlewares/auth");
const {
  createAcademincYear,
  getAcademincYears,
  getAcademincYear,
  updateAcademincYear,
  deleteAcademincYear,
} = require("../services/cademicYearServices");

const router = express.Router();

router
  .route("/")
  .post(isLogin, isAdmin, createAcademincYear)
  .get(protect, allowedTo("admin", "teacher"), advancedResults(AcademicYear), getAcademincYears);

router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getAcademincYear)
  .put(isLogin, isAdmin, updateAcademincYear)
  .delete(isLogin, isAdmin, deleteAcademincYear);

module.exports = router;
