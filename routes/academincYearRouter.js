const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const AcademicYear = require("../models/AcademicYear");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
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
  .get(isLogin, isAdmin,advancedResults(AcademicYear), getAcademincYears);
 
router
  .route("/:id")
  .get(isLogin, isAdmin, getAcademincYear)
  .put(isLogin, isAdmin, updateAcademincYear)
  .delete(isLogin, isAdmin, deleteAcademincYear);
 

module.exports = router;
