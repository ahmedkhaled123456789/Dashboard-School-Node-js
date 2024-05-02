const mongoose = require("mongoose");

const { Schema } = mongoose;

const expensesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expensesType: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true, 
    },
    amount: {
      type: Number,
      required: true, 
    },
    parentEmail: {
      type: String,
      required: true,
    }, 
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    date: {
      type: String,
      required: true,
     },

  },
  { timestamps: true }
);





// Mongoose query middleware
// expensesSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'teacher',
//     select: 'name -_id',
//   }); 
//   next(); 
// });
const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
