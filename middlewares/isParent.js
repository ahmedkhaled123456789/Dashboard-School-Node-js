const Parents = require("../models/Parents");
const ApiError = require("../utils/apiError");

const isParent = async (req, res, next) => {
  try {
    //find the user
    const parentFound = await Parents.findById(req.userAuth?._id);
    //check if parent
    if (parentFound?.role === "parent") {
      return next();
    }
    return next(new ApiError("Access Denied, Parents only", 403));
  } catch (err) {
    return next(err);
  }
};

module.exports = isParent;
