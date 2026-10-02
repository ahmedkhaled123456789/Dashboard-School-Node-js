const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const ClassLevel = require("../models/ClassLevel");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const { protect, allowedTo } = require("../middlewares/auth");
const {
  createClassLevel,
  getClassLevels,
  getClassLevel,
  updateclassLevel,
  deleteClassLevel,
} = require("../services/classLevel");

const router = express.Router();

router
  .route("/")
  .post(isLogin, isAdmin, createClassLevel)
  .get(protect, allowedTo("admin", "teacher"), advancedResults(ClassLevel), getClassLevels);

router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getClassLevel)
  .put(isLogin, isAdmin, updateclassLevel)
  .delete(isLogin, isAdmin, deleteClassLevel);

module.exports = router;
