const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const AcademicTerm = require("../models/AcademicTerm");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
  createAcademincTerm,
  getAcademincTerms,
  getAcademincTerm,
  updateAcademincTerm,
  deleteAcademincTerm,
} = require("../services/cademicTermServices");

const router = express.Router();
 
router
  .route("/")
  .post(isLogin, isAdmin, createAcademincTerm)
  .get(isLogin, isAdmin,advancedResults(AcademicTerm), getAcademincTerms);

router
  .route("/:id")
  .get(isLogin, isAdmin, getAcademincTerm)
  .put(isLogin, isAdmin, updateAcademincTerm)
  .delete(isLogin, isAdmin, deleteAcademincTerm);

module.exports = router;
