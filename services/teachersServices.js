const AysncHandler = require("express-async-handler");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

//@desc  Admin Register Teacher
//@route POST /api/teachers/admin/register
//@acess  Private

exports.adminRegisterTeacher = AysncHandler(async (req, res,next) => {
  const { name, email,classLevels, password,gender, phone, address, subject, religion } = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    return next(new ApiError("Admin not found", 404));
  }
  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    return next(new ApiError("Teacher already employed", 404));
  }

  // create
  const teacherCreated = await Teacher.create({
    name,
    email,
    phone,
    address, 
    subject,
    religion,
    gender,
    classLevels,
    password: await bcrypt.hash(req.body.password, 12),
  });
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
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
  // 2) check if user exist & check if password is correct
  const teacher = await Teacher.findOne({ email: req.body.email });

  if (
    !teacher ||
    !(await bcrypt.compare(req.body.password, teacher.password))
  ) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  res.status(200).json({
    status: "success",
    message: "Teacher logged in successfully",
    data: createToken(teacher._id),
  });
});

//@desc    Get all Teachers
//@route   GET /api/v1/admin/teachers
//@access  Private admin only

exports.getAllTeachersAdmin = AysncHandler(async (req, res,next) => {
  res.status(200).json(res.results);
});

//@desc    Get Single Teacher
//@route   GET /api/v1/teachers/:teacherID/admin
//@access  Private admin only

exports.getTeacherByAdmin = AysncHandler(async (req, res,next) => {
  const teacherID = req.params.teacherID;
  //find the teacher
  const teacher = await Teacher.findById(teacherID);
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

exports.getTeacherProfile = AysncHandler(async (req, res) => {
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

//@desc    Teacher updating profile admin
//@route    UPDATE /api/v1/teachers/:teacherID/update
//@access   Private Teacher only

exports.teacherUpdateProfile = AysncHandler(async (req, res) => {
  const { email, name, password, phone, address, subject, religion } = req.body;
  //if email is taken
 
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    return next(new ApiError("This email is taken/exist", 404));
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await bcrypt.hash(req.body.password, 12),
        name,
        phone,
        address,
        subject,
        religion,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher updated successfully",
    });
  } else {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
        phone,
        address,
        subject,
        religion,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher updated successfully",
    });
  }
});

//@desc     Admin updating Teacher profile
//@route    UPDATE /api/v1/teachers/:teacherID/admin
//@access   Private Admin only

exports.adminUpdateTeacher = AysncHandler(async (req, res,next) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    return next(new ApiError("Teacher not found", 404));
  }
  //Check if teacher is withdrawn
  if (teacherFound.isWitdrawn) {
    return next(new ApiError("Action denied, teacher is withdraw", 404));
  }
  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Academic year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }
});



//@desc   Delete  Teacher
 //@acess  Private
 exports.deleteTeacher = AysncHandler(async (req, res) => {
  await Teacher.findOneAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Teacher deleted successfully",
  });
});