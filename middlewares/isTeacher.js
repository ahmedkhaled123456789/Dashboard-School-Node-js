const Teacher = require("../models/Teacher");
const ApiError = require("../utils/apiError");

const isTeacher = async (req, res, next) => {
  try {
    //find the user
    const teacherFound = await Teacher.findById(req.userAuth?._id);
    //check if teacher
    if (teacherFound?.role === "teacher") {
      return next();
    }
    return next(new ApiError("Access Denied, Teachers only", 403));
  } catch (err) {
    return next(err);
  }
};

module.exports = isTeacher;
