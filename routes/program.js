const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const Program = require("../models/Program");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const { protect, allowedTo } = require("../middlewares/auth");
const {
  createProgram,
  getPrograms,
  getProgram,
  updatProgram,
  deleteProgram,
} = require("../services/programs");

const router = express.Router();

router
  .route("/")
  .post(isLogin, isAdmin, createProgram)
  .get(protect, allowedTo("admin", "teacher"), advancedResults(Program), getPrograms);

router
  .route("/:id")
  .get(protect, allowedTo("admin", "teacher"), getProgram)
  .put(isLogin, isAdmin, updatProgram)
  .delete(isLogin, isAdmin, deleteProgram);

module.exports = router;
