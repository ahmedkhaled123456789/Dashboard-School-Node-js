const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

const isAdmin = async (req, res, next) => {
  //find the user
  const userId = req.userAuth._id;
  const adminFound = await Admin.findById(userId);
  //check if admin
  if (adminFound.role === "admin") {
    next();
  } else {
    next(new ApiError("Access Denied, admin only"));
  }
};

module.exports = isAdmin;
