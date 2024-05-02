const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    city: {
      type: String,
     },
    lauguage: {
      type: String,
     },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    phone: {
      type: String,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    academicTerms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicTerm",
      },
    ],
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    yearGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "YearGroup",
      },
    ],
    academicYears: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
      },
    ],
    subject: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    classLevels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      
    ],
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parents",
      },
      
    ],
    feesgroup: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feesgroup",
      },
      
    ],
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expenses",
      },
      
    ],
  },
  {
    timestamps: true,
  }
);
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); 
  } 
  //salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//verifyPassword
adminSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); 
};
//model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
