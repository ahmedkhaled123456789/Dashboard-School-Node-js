const AysncHandler = require("express-async-handler");
const Expenses = require("../models/Expenses");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create Expenses
//@route POST /api/v1/expenses
//@acess  Private
exports.createExpenses = AysncHandler(async (req, res,next) => {
  const { name, phone, amount,status,date,parentEmail,expensesType } = req.body;
  //check if exists
  const expenses = await Expenses.findOne({ parentEmail });
  if (expenses) {
    return next(new ApiError("class already exists", 404));
  }
  //create
  const expensesCreated = await Expenses.create({
    name, phone, amount,status,date,parentEmail,expensesType,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.expenses.push(expensesCreated._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "expenses created successfully",
    data: expensesCreated,
  });
});

//@desc  get all Expenses
//@route GET /api/v1/expenses
//@acess  Private
exports.getExpenses = AysncHandler(async (req, res, next) => {
  res.status(200).json(res.results);

});

 

//@desc   Update  Expenses
//@route  PUT /api/v1/expenses/:id
//@acess  Private

exports.updateExpenses = AysncHandler(async (req, res, next) => {
  const { name, phone, amount,status,date,parentEmail,expensesType,} = req.body;
  // //check name exists
  // const expensesFound = await Expenses.findOne({ name });
  // if (!expensesFound) {
  //   return next(new ApiError("Expenses not found ", 404));
  // }
  const expenses = await Expenses.findByIdAndUpdate(
    req.params.id,
    {
     $set:{
      name, phone, amount,status,date,parentEmail,expensesType,
      },
    },
    { 
      new: true,
    }
  );

  res.status(201).json({ 
    status: "success",
    data: expenses,
    message: "expenses  updated successfully",
  });
});

//@desc   Delete  Expenses
//@route  PUT /api/v1/expenses/:id
//@acess  Private
exports.deleteExpenses = AysncHandler(async (req, res) => {
  await Expenses.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Expenses deleted successfully",
  });
});
