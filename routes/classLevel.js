const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const ClassLevel = require("../models/ClassLevel");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
   createClassLevel,getClassLevel,getClassLevels,updateclassLevel,deleteClassLevel
} = require("../services/classLevel");
const student = require("./student");

const router = express.Router();
router.use("/:id/students", student);
 
 router
  .route("/")
  .post(isLogin, isAdmin, createClassLevel)
  .get(isLogin, isAdmin,advancedResults(ClassLevel), getClassLevels);
 
router
  .route("/:id")
  .get(isLogin, isAdmin, getClassLevel)
  .put(isLogin, isAdmin, updateclassLevel)
  .delete(isLogin, isAdmin, deleteClassLevel);
 

module.exports = router;
