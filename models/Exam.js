const mongoose = require("mongoose");

const { Schema } = mongoose;

//examSchema
const examSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    
    passMark: {
      type: Number,
      required: true,
      default: 50,
    },
    totalMark: {
      type: Number,
      required: true,
      default: 100,
    },

    
    duration: {
      type: String,
      required: true,
      default: "30 minutes",
    },
    examDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    examTime: {
      type: String,
      default: "",
    },
    examType: {
      type: String,
      required: true,
      default: "Quiz",
    },
    examStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "live"],
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    classLevel: {
      type: Schema.Types.ObjectId,
      ref: "ClassLevel",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
    academicTerm: {
      type: Schema.Types.ObjectId,
      ref: "AcademicTerm",
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
    }, 
     
  },
  { timestamps: true }
);
// // Mongoose query middleware
// examSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'questions',
//     select: '  -_id',
//   });
//   next();
// });
const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
