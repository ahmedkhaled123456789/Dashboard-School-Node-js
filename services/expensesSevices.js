const AysncHandler = require("express-async-handler");
const Expenses = require("../models/Expenses");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

//@desc  Create Expenses
//@route POST /api/v1/expenses
//@acess  Private
exports.createExpenses = AysncHandler(async (req, res) => {
  const { name, phone, amount, status, date, parentEmail, expensesType } =
    req.body;
  //create
  const expensesCreated = await Expenses.create({
    name,
    phone,
    amount,
    status,
    date,
    parentEmail,
    expensesType,
    createdBy: req.userAuth._id,
  });
  //push expenses into admin
  await Admin.findByIdAndUpdate(req.userAuth._id, {
    $push: { expenses: expensesCreated._id },
  });

  res.status(201).json({
    status: "success",
    message: "expenses created successfully",
    data: expensesCreated,
  });
});

//@desc  get all Expenses
//@route GET /api/v1/expenses
//@acess  Private
exports.getExpenses = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc   Update  Expenses
//@route  PUT /api/v1/expenses/:id
//@acess  Private
exports.updateExpenses = AysncHandler(async (req, res, next) => {
  const { name, phone, amount, status, date, parentEmail, expensesType } =
    req.body;
  const expenses = await Expenses.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name, phone, amount, status, date, parentEmail, expensesType },
    },
    { new: true, runValidators: true }
  );
  if (!expenses) {
    return next(new ApiError("Expenses not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: expenses,
    message: "expenses  updated successfully",
  });
});

//@desc   Delete  Expenses
//@route  DELETE /api/v1/expenses/:id
//@acess  Private
exports.deleteExpenses = AysncHandler(async (req, res, next) => {
  const expenses = await Expenses.findByIdAndDelete(req.params.id);
  if (!expenses) {
    return next(new ApiError("Expenses not found", 404));
  }
  await Admin.updateMany({}, { $pull: { expenses: expenses._id } });
  res.status(200).json({
    status: "success",
    message: "Expenses deleted successfully",
  });
});
