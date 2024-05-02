const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const Expenses = require("../models/Expenses");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
   createExpenses,getExpenses ,updateExpenses,deleteExpenses
} = require("../services/expensesSevices");
const student = require("./student");

const router = express.Router();
router.use("/:id/students", student);

 router
  .route("/")
  .post(isLogin, isAdmin, createExpenses)
  .get(isLogin, isAdmin,advancedResults(Expenses), getExpenses);
 
router
  .route("/:id")
   .put(isLogin, isAdmin, updateExpenses)
  .delete(isLogin, isAdmin, deleteExpenses);
 

module.exports = router;
