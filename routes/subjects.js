const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const Subject = require("../models/Subject");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
 createSubject,getSubjects,getSubject,updatSubject,deleteSubject
} = require("../services/subjects");

const router = express.Router();
 router 
  .route("/")
  .get(isLogin, isAdmin,advancedResults(Subject),  getSubjects) 
  .post(isLogin, isAdmin ,createSubject)
  
router
  .route("/:id")
  .get(isLogin, isAdmin, getSubject)
  .put(isLogin, isAdmin, updatSubject)
  .delete( deleteSubject);
 

module.exports = router;
