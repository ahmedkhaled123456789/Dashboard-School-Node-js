const Parents = require("../models/Parents");
const ApiError = require("../utils/apiError");

const isParent = async (req, res, next) => {
  //find the user
  const userId = req.userAuth._id;
  const parentFound = await Parents.findById(userId);
  //check if admin
  if (parentFound.role === "parent") {
    next();
  } else {
    
    next(new ApiError("Access Denied, Parents only"));
  }
};

module.exports = isParent;
