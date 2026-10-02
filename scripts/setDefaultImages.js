// Gives every existing user without a real profile picture the default one
// (missing, empty, or a leftover placeholder like "profile.jpg").
// usage: npm run images:default
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parents = require("../models/Parents");
const { DEFAULT_USER_IMAGE } = require("../utils/userImage");

// keep uploaded pictures (data urls / links) and the default itself
const missingImage = {
  $or: [
    { image: { $exists: false } },
    { image: null },
    {
      image: {
        $nin: [DEFAULT_USER_IMAGE],
        $not: /^(data:image\/|https?:\/\/)/,
      },
    },
  ],
};

async function main() {
  await mongoose.connect(process.env.DB_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);

  for (const [label, Model] of Object.entries({ Admin, Teacher, Student, Parents })) {
    const result = await Model.updateMany(missingImage, {
      $set: { image: DEFAULT_USER_IMAGE },
    });
    const total = await Model.countDocuments();
    console.log(`${label}: ${result.modifiedCount} updated (${total} total)`);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
