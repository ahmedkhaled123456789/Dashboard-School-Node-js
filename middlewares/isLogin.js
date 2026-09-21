const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

exports.isLogin = asyncHandler(async (req, res, next) => {
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

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError("Your login token has expired, please login again", 401)
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError("Invalid login token", 401));
    }

    return next(error);
  }
  console.log(decoded);
  // 3) ckeck if user exist
  const currentUser = await Admin.findById(decoded.userId).select(
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
} 

);
