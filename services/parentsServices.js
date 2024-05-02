const AysncHandler = require("express-async-handler");
const Parents = require("../models/Parents");
const Admin = require("../models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

//@desc  Admin Register Parents
//@route POST /api/Parents/admin/register
//@acess  Private

exports.adminRegisterParents = AysncHandler(async (req, res,next) => {
  const { name, email, password,student, phone, address,occupation, religion,id } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    return next(new ApiError("Admin not found", 404));
  }
  //check if Parents already exists
  const parents = await Parents.findOne({ email });
  if (parents) {
    return next(new ApiError("Parents already employed", 404));
  }

  // create
  const parentsCreated = await Parents.create({
    name,
    email,
    phone,
    address,
    occupation,
    religion,
    student,
    password: await bcrypt.hash(req.body.password, 12),
  });
  //push Parents into admin
  adminFound.parents.push(parentsCreated?._id);
  await adminFound.save();
  //send Parents data
  res.status(201).json({
    status: "success",
    message: "Parents registered successfully",
    data: parentsCreated,
  });
});

//@desc    login a Parents
//@route   POST /api/v1/Parents/login
//@access  Public

exports.loginParents = AysncHandler(async (req, res, next) => {
  // 2) check if user exist & check if password is correct
  const parents = await Parents.findOne({ email: req.body.email });

  if (
    !parents ||
    !(await bcrypt.compare(req.body.password, parents.password))
  ) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  res.status(200).json({
    status: "success",
    message: "Parents logged in successfully",
    data: createToken(parents._id),
  });
});

//@desc    Get all Parents
//@route   GET /api/v1/admin/Parents
//@access  Private admin only

exports.getAllParentsAdmin = AysncHandler(async (req, res,next) => {
  res.status(200).json(res.results);

});

//@desc    Get Single Parents
//@route   GET /api/v1/Parents/:parentID/admin
//@access  Private admin only

exports.getParentsByAdmin = AysncHandler(async (req, res,next) => {
  const parentID = req.params.parentID;
  //find the Parents
  const parents = await Parents.findById(parentID);
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Parent fetched successfully",
    data: parents,
  });
});

//@desc    Parent Profile
//@route   GET /api/v1/Parents/profile
//@access  Private Parents only

exports.getParentsProfile = AysncHandler(async (req, res) => {
  const parents = await Parents.findById(req.userAuth._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!parents) {
    return next(new ApiError("Parent not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: parents,
    message: "Parent Profile fetched  successfully",
  });
});

 

//@desc     Admin updating Parents profile
//@route    UPDATE /api/v1/Parents/:parentID/admin
//@access   Private Admin only

exports.adminUpdateParents = AysncHandler(async (req, res,next) => {
  const { id } = req.params;

  const { email, name, password, phone, address } = req.body;
  //if email is taken
  const emailExist = await Parents.findOne({ email });
  if (emailExist) {
    return next(new ApiError("This email is taken/exist"));
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const parents = await Parents.findByIdAndUpdate(
      id,
      {
        email,
        password: await bcrypt.hash(req.body.password, 12),
        name,
        phone,
        address,
        occupation
       },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: parents,
      message: "Parent updated successfully",
    });
  } else {
    //update
    const parents = await Parents.findByIdAndUpdate(
      id,
      {
        email,
        name,
        phone,
        occupation,
        address,
       },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: parents,
      message: "Parent updated successfully",
    });
  }
});
