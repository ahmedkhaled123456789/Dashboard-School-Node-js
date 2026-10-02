const AysncHandler = require("express-async-handler");
const { MODELS } = require("../middlewares/auth");
const ApiError = require("../utils/apiError");
const { validateImage, normalizeImage } = require("../utils/userImage");

//@desc   Change the signed-in user's profile picture ("" => default picture)
//@route  PUT /api/v1/profile/image
//@acess  Private - admin / teacher / student / parent
exports.updateMyImage = AysncHandler(async (req, res, next) => {
  const { image } = req.body;
  const error = validateImage(image);
  if (error) {
    return next(new ApiError(error, 400));
  }
  const Model = MODELS[req.userAuth.role];
  const user = await Model.findByIdAndUpdate(
    req.userAuth._id,
    { image: normalizeImage(image) },
    { new: true }
  ).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully",
    data: user,
  });
});
