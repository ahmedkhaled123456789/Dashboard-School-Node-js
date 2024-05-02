const Student = require("../models/Student");
 const ApiError = require("../utils/apiError");

const isStdudent = async (req, res, next) => {
  //find the user
  const userId = req?.userAuth?._id;
  const studentFound = await Student.findById(userId);
  //check if student
  if (studentFound?.role === "student") {
    next();
  } else {
    next(new ApiError("Access Denied, student only"));
  }
};

module.exports = isStdudent;
