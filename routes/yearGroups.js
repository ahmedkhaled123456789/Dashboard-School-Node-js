const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const YearGroup = require("../models/YearGroup");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
  createYearGroup,getYearGroups,getYearGroup,updateYearGroup,deleteYearGroup
 } = require("../services/yearGroups");

const router = express.Router();
//create YearGroup Year
router
  .route("/")
  .post(isLogin, isAdmin, createYearGroup)
  .get(isLogin, isAdmin,advancedResults(YearGroup), getYearGroups);
 
router
  .route("/:id")
  .get(isLogin, isAdmin, getYearGroup)
  .put(isLogin, isAdmin, updateYearGroup)
  .delete(isLogin, isAdmin, deleteYearGroup);
 

module.exports = router;
