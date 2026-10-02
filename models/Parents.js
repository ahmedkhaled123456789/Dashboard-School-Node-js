const mongoose = require("mongoose");
const { DEFAULT_USER_IMAGE } = require("../utils/userImage");
const parentsSchema = new mongoose.Schema(
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
    parentId: {
      type: String,
      required: true,
      default: function () {
        return (
          "par" +
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
     phone: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    
    occupation: {
      type: String,
      required: true,
    },
    
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "parent",
    },
    // profile picture: base64 data url / url, defaults to the shared picture
    image: {
      type: String,
      default: DEFAULT_USER_IMAGE,
    },
    
    student: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
    // never send the password hash to the client
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);
// Mongoose query middleware
parentsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'student',
    select: 'name -_id',
  });
  next();
});
//model
const Parents = mongoose.model("Parents", parentsSchema);

module.exports = Parents;
