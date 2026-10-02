const ApiError = require("../utils/apiError");

// Translate common library errors into clear client errors
const normalizeError = (err) => {
  if (err.name === "JsonWebTokenError") {
    return new ApiError("Invalid token, please login again", 401);
  }
  if (err.name === "TokenExpiredError") {
    return new ApiError("Expired token, please login again", 401);
  }
  if (err.name === "CastError") {
    return new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return new ApiError(message, 400);
  }
  if (err.code === 11000) {
    return new ApiError("Duplicate value, this record already exists", 400);
  }
  return err;
};

const globalError = (error, req, res, next) => {
  const err = normalizeError(error);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = globalError;
