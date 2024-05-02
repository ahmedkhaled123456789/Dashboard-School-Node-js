const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const Program = require("../models/Program");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
   createProgram,getProgram,getPrograms,updatProgram,deleteProgram
} = require("../services/programs");

const router = express.Router();
 router
  .route("/")
  .post(isLogin, isAdmin, createProgram)
  .get(isLogin, isAdmin,advancedResults(Program), getPrograms);
 
router
  .route("/:id")
  .get(isLogin, isAdmin, getProgram)
  .put(isLogin, isAdmin, updatProgram)
  .delete(isLogin, isAdmin, deleteProgram);
 

module.exports = router;
