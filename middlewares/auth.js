const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parents = require("../models/Parents");
const ApiError = require("../utils/apiError");

// Looks up the token owner in every user collection, so one route can serve
// several roles (e.g. admin sees all exams, teacher sees only his own exams).
const MODELS = {
  admin: Admin,
  teacher: Teacher,
  student: Student,
  parent: Parents,
};
exports.MODELS = MODELS;

exports.protect = asyncHandler(async (req, res, next) => {
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

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  for (const Model of Object.values(MODELS)) {
    // eslint-disable-next-line no-await-in-loop
    const user = await Model.findById(decoded.userId).select(
      "name email role classLevels studentId"
    );
    if (user) {
      req.userAuth = user;
      return next();
    }
  }

  return next(
    new ApiError("the user that belong to this token does no longer exist", 401)
  );
});

// usage: allowedTo("admin", "teacher")
exports.allowedTo = (...roles) =>
  (req, res, next) => {
    if (!req.userAuth || !roles.includes(req.userAuth.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  };
