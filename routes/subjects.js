const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const Subject = require("../models/Subject");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const { protect, allowedTo } = require("../middlewares/auth");
const {
  createSubject,
  getSubjects,
  getSubject,
  updatSubject,
  deleteSubject,
} = require("../services/subjects");

const router = express.Router();

router
  .route("/")
  .post(isLogin, isAdmin, createSubject)
  .get(protect, allowedTo("admin", "teacher"), advancedResults(Subject), getSubjects);

router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getSubject)
  .put(isLogin, isAdmin, updatSubject)
  .delete(isLogin, isAdmin, deleteSubject);

module.exports = router;
