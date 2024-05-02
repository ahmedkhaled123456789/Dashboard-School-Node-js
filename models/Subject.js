const mongoose = require("mongoose");

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", 
    },
    academicTerm: {
      type: Schema.Types.ObjectId,
      ref: "AcademicTerm",
      // required: true,
    }, 
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "3 months",
    },
  },
  { timestamps: true }
);





// Mongoose query middleware
subjectSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'teacher',
    select: 'name -_id',
  }); 
  next(); 
});
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
