const AysncHandler = require("express-async-handler");
const Student = require(".././models/Student");
const Exam = require(".././models/Exam");
const ExamResult = require(".././models/ExamResults");
const Admin = require(".././models/Admin");

const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
//@desc  Admin Register Student
//@route POST /api/students/admin/register
//@acess  Private Admin only

exports.adminRegisterStudent = AysncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    admissionDate,
    phone,
    address,
    gender,
      fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    religion,
    status,
    classLevels,
    fatherEmail


  } = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exists
  const student = await Student.findOne({ email });
  if (student) {
    return next(new ApiError("Student already employed", 404));
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  // create
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
    admissionDate,
    phone,
    address,
    gender,
      fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    religion,
    status,
    classLevels,
    fatherEmail
  });
  //push student into admin
  adminFound.students.push(studentRegistered?._id);
  await adminFound.save();
  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentRegistered,
  });
});

//@desc    login  student
//@route   POST /api/v1/students/login
//@access  Public

exports.loginStudent = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //find the  user
  const student = await Student.findOne({ email });
  if (!student || !(await bcrypt.compare(password, student.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  res.status(200).json({
    status: "success",
    message: "Student logged in successfully",
    data: createToken(student?._id),
  });
});

//@desc    Student Profile
//@route   GET /api/v1/students/profile
//@access  Private Student only

exports.getStudentProfile = AysncHandler(async (req, res, next) => {
  const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    .populate("examResults");
  if (!student) {
    return next(new ApiError("Student not found", 404));
  }
  //get student profile
  const studentProfile = {
    name: student?.name,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAtmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    isWithdrawn: student?.isWithdrawn,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };

  //get student exam results
  const examResults = student?.examResults;
  //current exam
  const currentExamResult = examResults[examResults.length - 1];
  //check if exam is published
  const isPublished = currentExamResult?.isPublished;
  //send response
  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
    message: "Student Profile fetched  successfully",
  });
});

//@desc    Get all Students
//@route   GET /api/v1/admin/students
//@access  Private admin only

exports.getAllStudentsByAdmin = AysncHandler(async (req, res, next) => {
   
  console.log(req.params)
 
  res.status(200).json(res.results);
});

//@desc    Get Single Student
//@route   GET /api/v1/students/:studentID/admin
//@access  Private admin only

exports.getStudentByAdmin = AysncHandler(async (req, res, next) => {
  const studentID = req.params.studentID;
  //find the teacher
  const student = await Student.findById(studentID);
  if (!student) {
    return next(new ApiError("Student not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

//@desc    Student updating profile
//@route    UPDATE /api/v1/students/update
//@access   Private Student only

exports.studentUpdateProfile = AysncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    return next(new ApiError("This email is taken/exist", 404));
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await bcrypt.hash(req.body.password, 12),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  }
});

//@desc     Admin updating Students eg: Assigning classes....
//@route    UPDATE /api/v1/students/:studentID/update/admin
//@access   Private Admin only

exports.adminUpdateStudent = AysncHandler(async (req, res, next) => {
  const { name,
    email,
    password,
    admissionDate,
    phone,
    address,
    gender,
      fatherOccupation,
    dateOfBirth,
    motherName,
    fatherName,
    fatherEmail,
    religion,
    status,
    classLevels } =
    req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    return next(new ApiError("Student not found", 404));
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        password,
        admissionDate, 
        phone,
        address,
        gender,
          fatherOccupation,
        dateOfBirth,
        motherName,
        fatherName,
        religion,
        status, 
        classLevels
         
      },
      // $addToSet: {
      //   classLevels,
      // },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student updated successfully",
  });
});

//@desc     Student taking Exams
//@route    POST /api/v1/students/exams/:examID/write
//@access   Private Students only

exports.writeExam = AysncHandler(async (req, res, next) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    return next(new ApiError("Student not found", 404));
  }
  //Get exam 
  const examFound = await Exam.findById(req.params.examID)
    .populate("questions") 
    // .populate("academicTerm");
  console.log(examFound);

  if (!examFound) {
    return next(new ApiError("Exam not found", 404));
  }
  //get questions
  const questions = examFound?.questions;
  //get students questions answers
  const studentAnswers = req.body.answers;
  console.log("studentAnswers:", studentAnswers);
  console.log("questions:", questions);
  //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    return next(new ApiError("You have not answered all the questions", 404));
  }

  // check if student has already taken the exams
  const studentFoundInResults = await ExamResult.findOne({
    student: studentFound?._id,
  });
  if (studentFoundInResults) {
    return next(new ApiError("You have already written this exam", 404));
  }

  //Build report object
  let correctanswers = 0;
  let wrongAnswers = 0;
  let status = ""; //failed/passed
  let grade = 0;
  let remarks = "";
  let score = 0;
  let answeredQuestions = [];

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctanswers++; 
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }
  //calculate reports
  totalQuestions = questions.length;
  grade = (correctanswers / questions.length) * 100;
  answeredQuestions = questions.map((question) => {
    return {
      question: question.question,
      correctanswer: question.correctAnswer,
      isCorrect: question.isCorrect,
    };
  });

  //calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam results
  const examResults = await ExamResult.create({
    studentID: studentFound?.studentId,
    exam: examFound?._id,
    grade,
    score,
    status, 
    remarks,
    classLevel: examFound?.classLevel,
    // academicTerm: examFound?.academicTerm,
    // academicYear: examFound?.academicYear,
    answeredQuestions: answeredQuestions,
  });
  // //push the results into
  studentFound.examResults.push(examResults?._id);
  // //save
  await studentFound.save();

  //Promoting
  //promote student to level 200
  if (
    // examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    await studentFound.save();
  } 

  //promote student to level 300
  if (
    // examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    await studentFound.save();
  }

  //promote student to level 400
  if (
    // examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    await studentFound.save();
  }

  //promote student to graduate
  if (
    // examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  res.status(200).json({
    status: "success",
    data: "You have submitted your exam. Check later for the results",
  });
});



//@desc   Delete  student
 //@acess  Private
exports.deleteStudent = AysncHandler(async (req, res) => {
  await Student.findOneAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Student deleted successfully",
  });
});