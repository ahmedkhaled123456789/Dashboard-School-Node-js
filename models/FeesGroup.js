const mongoose = require("mongoose");

const { Schema } = mongoose;

const FeesGroupSchema = new Schema(
  {
    //level100/200/300/400
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,

    },
    feesType: {
      type: String,
      required: true,

    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
     students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
     
    
  },
  { timestamps: true }
);

const FeesGroup = mongoose.model("FeesGroup", FeesGroupSchema);

module.exports = FeesGroup;
