const Teacher = require("../models/Teacher");
const ApiError = require("../utils/apiError");

const isTeacher = async (req, res, next) => {
  //find the user
  const userId = req.userAuth._id;
  const teacherFound = await Teacher.findById(userId);
  //check if admin
  if (teacherFound.role === "teacher") {
    next();
  } else {
    
    next(new ApiError("Access Denied, Teachers only"));
  }
};

module.exports = isTeacher;
