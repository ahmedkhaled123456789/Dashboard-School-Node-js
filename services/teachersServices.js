const AysncHandler = require("express-async-handler");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

//@desc  Admin Register Teacher
//@route POST /api/v1/teachers/admins/register
//@acess  Private
exports.adminRegisterTeacher = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    classLevels,
    password,
    gender,
    phone,
    address,
    subject,
    religion,
  } = req.body;
  if (!password) {
    return next(new ApiError("Password is required", 400));
  }
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    return next(new ApiError("Admin not found", 404));
  }
  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    return next(new ApiError("Teacher already employed", 400));
  }

  // create
  const teacherCreated = await Teacher.create({
    name,
    email,
    phone,
    address,
    subject: subject || undefined,
    religion,
    gender,
    classLevels,
    createdBy: adminFound._id,
    password: await bcrypt.hash(password, 12),
  });
  //push teacher into admin
  await Admin.findByIdAndUpdate(adminFound._id, {
    $push: { teachers: teacherCreated._id },
  });
  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
});

//@desc    login a teacher
//@route   POST /api/v1/teachers/login
//@access  Public
exports.loginTeacher = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email });

  if (!teacher || !(await bcrypt.compare(password || "", teacher.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  if (teacher.isWitdrawn) {
    return next(new ApiError("Your account has been withdrawn", 403));
  }
  res.status(200).json({
    status: "success",
    message: "Teacher logged in successfully",
    token: createToken(teacher._id),
    data: teacher,
  });
});

//@desc    Get all Teachers
//@route   GET /api/v1/teachers/admin
//@access  Private admin only
exports.getAllTeachersAdmin = AysncHandler(async (req, res) => {
  res.status(200).json(res.results);
});

//@desc    Get Single Teacher
//@route   GET /api/v1/teachers/:teacherID/admin
//@access  Private admin only
exports.getTeacherByAdmin = AysncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.teacherID);
  if (!teacher) {
    return next(new ApiError("Teacher not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Teacher fetched successfully",
    data: teacher,
  });
});

//@desc    Teacher Profile
//@route   GET /api/v1/teachers/profile
//@access  Private Teacher only
exports.getTeacherProfile = AysncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.userAuth._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!teacher) {
    return next(new ApiError("Teacher not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher Profile fetched  successfully",
  });
});

//@desc    Teacher updating his own profile
//@route   PUT /api/v1/teachers/:teacherID/update
//@access  Private Teacher only
exports.teacherUpdateProfile = AysncHandler(async (req, res, next) => {
  const { email, name, password, phone, address, religion } = req.body;
  const teacherId = req.userAuth._id;
  //if email is taken by another teacher
  if (email) {
    const emailExist = await Teacher.findOne({
      email,
      _id: { $ne: teacherId },
    });
    if (emailExist) {
      return next(new ApiError("This email is taken/exist", 400));
    }
  }

  const update = { email, name, phone, address, religion };
  //check if user is updating password
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }

  const teacher = await Teacher.findByIdAndUpdate(teacherId, update, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher updated successfully",
  });
});

//@desc     Admin updating Teacher profile / assigning program, class, year, subject
//@route    PUT /api/v1/teachers/:teacherID/admin
//@access   Private Admin only
exports.adminUpdateTeacher = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    gender,
    phone,
    address,
    religion,
    subject,
    classLevels,
    classLevel,
    program,
    academicYear,
    academicTerm,
    isSuspended,
    isWitdrawn,
    applicationStatus,
  } = req.body;
  const { teacherID } = req.params;

  const teacherFound = await Teacher.findById(teacherID);
  if (!teacherFound) {
    return next(new ApiError("Teacher not found", 404));
  }
  //Check if teacher is withdrawn (allow re-activating him only)
  if (teacherFound.isWitdrawn && isWitdrawn !== false) {
    return next(new ApiError("Action denied, teacher is withdraw", 400));
  }
  //if email is taken by another teacher
  if (email) {
    const emailExist = await Teacher.findOne({ email, _id: { $ne: teacherID } });
    if (emailExist) {
      return next(new ApiError("This email is taken/exist", 400));
    }
  }

  const update = {
    name,
    email,
    gender,
    phone,
    address,
    religion,
    subject: subject || undefined,
    program,
    academicYear,
    academicTerm,
    isSuspended,
    isWitdrawn,
    applicationStatus,
  };
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }
  if (Array.isArray(classLevels)) {
    update.classLevels = classLevels;
  }

  const query = { $set: update };
  // assign a single class level (kept for the old "classLevel" field)
  if (classLevel && !Array.isArray(classLevels)) {
    query.$addToSet = { classLevels: classLevel };
  }

  const teacher = await Teacher.findByIdAndUpdate(teacherID, query, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher updated successfully",
  });
});

//@desc   Delete  Teacher
//@route  DELETE /api/v1/teachers/:teacherID/admin
//@acess  Private admin only
exports.deleteTeacher = AysncHandler(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.teacherID);
  if (!teacher) {
    return next(new ApiError("Teacher not found", 404));
  }
  await Admin.updateMany({}, { $pull: { teachers: teacher._id } });
  res.status(200).json({
    status: "success",
    message: "Teacher deleted successfully",
  });
});
