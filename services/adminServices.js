const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

const createToken = require("../utils/createToken");
// @desc     register admin
// @route   POST /api/v1/admins/register
// @access  private
exports.registerAdminServices = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address, schoolName,city,lauguage } = req.body;

  //Check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    return next(new ApiError("admin exist", 404));
  }
  //register 
  const user = await Admin.create({
    name,
    email,
    password,
    phone,
    address,
    schoolName,
    city,lauguage
  });

  // 2- Generate token
  const token = createToken(user._id);
  res.status(201).json({
    status: "success",
    data: user,
    token,
  });
});

// @desc     login admin
// @route   POST /api/v1/admins/login
// @access  private
exports.loginAdminServices = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await Admin.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3) generate token
  const token = createToken(user._id);
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc     get all admins
// @route   GET /api/v1/admins
// @access  private
exports.getAdminsServices = asyncHandler(async (req, res, next) => {
  const admin = await Admin.find();
  res.status(200).json({
    status: "success",
    message: "admin fetched successfully",
    data: admin,
  });
});

//@desc     Get profile admin
//@route    GET /api/v1/admins/:id
//@access   Private

exports.getAdminProfileServices = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears")
    .populate("academicTerms")
    .populate("programs")
    .populate("yearGroups")
    .populate("classLevels")
    .populate("teachers")
    .populate("students");
  if (!admin) {
    throw new ApiError("Admin Not Found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
    });
  }
});

// @desc     update admin
// @route   put /api/v1/admins/:id
// @access  private
exports.updateAdminServices = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { email, name, password, phone, address, schoolName ,city,lauguage} = req.body;
  //if email is taken
  const emailExist = await Admin.findOne({ email });
  if (emailExist) {
    return next(new ApiError("This email is taken/exist"));
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const admin = await Admin.findByIdAndUpdate(
      id,
      {
        email,
        password: await bcrypt.hash(req.body.password, 12),
        name,
        phone,
        address,
        schoolName,
        city,lauguage
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  } else {
    //update
    const admin = await Admin.findByIdAndUpdate(
      id,
      {
        email,
        name,
        phone,
        address,
        schoolName,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  }
});

 

// @desc     delete admin
// @route   delete /api/v1/admins/:id
// @access  private
exports.deleteAdminServices = asyncHandler(async (req, res,next) => {
  const { id } = req.params;

  const document = await Admin.findByIdAndDelete(id);
  if (!document) {
     return next(new ApiError(`no document for this ${id}`, 404));
  }
 
  res.status(204).send();
});
 
 