const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    fatherEmail: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    fatherOccupation: {
      type: String,
      required: true,
    },
    admissionDate: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean, 
      default: false,
    },
    // parents: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Parents",
    //   },
    // ],
    studentId: {
      type: String,
      required: true,
      default: function () {
        return (
          "STU" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) +
          this.name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase()
        );
      },
    },
    role: {
      type: String,
      default: "student",
    },
    //Classes are from level 1 to 6
    //keep track of the class level the student is in
    classLevels: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
      },
    ],
    currentClassLevel: {
      type: String,
      default: function () {
        return this.classLevels[this.classLevels.length - 1];
      },
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },

    examResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamResult",
      },
    ],

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },

    isPromotedToLevel200: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel300: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel400: {
      type: Boolean,
      default: false,
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    prefectName: {
      type: String, 
    },
  
    //year group
    yearGraduated: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

 
// Mongoose query middleware
studentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'classLevels',
    select: 'name amount _id',
  });
  next();
});
//model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
