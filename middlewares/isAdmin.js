const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");

const isAdmin = async (req, res, next) => {
  try {
    //find the user
    const adminFound = await Admin.findById(req.userAuth?._id);
    //check if admin
    if (adminFound?.role === "admin") {
      return next();
    }
    return next(new ApiError("Access Denied, admin only", 403));
  } catch (err) {
    return next(err);
  }
};

module.exports = isAdmin;
