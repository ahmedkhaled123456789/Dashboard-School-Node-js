const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const ApiError = require("../utils/apiError");

exports.isStudentLogin = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  // 3) ckeck if user exist
  const currentUser = await Student.findById(decoded.userId).select(
    "name email role"
  );
  if (!currentUser) {
    next(
      new ApiError(
        "the user that belong to this token does no longer exist",
        401
      )
    );
  }

  //save the user into req.obj
  req.userAuth = currentUser;

  next();
});
