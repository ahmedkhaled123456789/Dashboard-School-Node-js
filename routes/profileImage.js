const express = require("express");
const { protect, allowedTo } = require("../middlewares/auth");
const { updateMyImage } = require("../services/profileImageServices");

const router = express.Router();

router
  .route("/image")
  .put(protect, allowedTo("admin", "teacher", "student", "parent"), updateMyImage);

module.exports = router;
