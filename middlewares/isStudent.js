const Student = require("../models/Student");
const ApiError = require("../utils/apiError");

const isStdudent = async (req, res, next) => {
  try {
    //find the user
    const studentFound = await Student.findById(req.userAuth?._id);
    //check if student
    if (studentFound?.role === "student") {
      return next();
    }
    return next(new ApiError("Access Denied, student only", 403));
  } catch (err) {
    return next(err);
  }
};

module.exports = isStdudent;
