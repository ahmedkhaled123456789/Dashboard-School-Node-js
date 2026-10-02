const express = require("express");
const {
  registerAdminServices,
  loginAdminServices,
  getAdminsServices,
  updateAdminServices,
  deleteAdminServices,
  getAdminProfileServices,
} = require("./../services/adminServices");
const { isLogin } = require("../middlewares/isLogin");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

//admin register
router.post("/register", registerAdminServices);

//login
router.post("/login", loginAdminServices);

// get all admin
router.get("/", isLogin, isAdmin, getAdminsServices);

//profile
router.get("/profile", isLogin, isAdmin, getAdminProfileServices);

// update admin
router.put("/:id", isLogin, isAdmin, updateAdminServices);
// delete admin
router.delete("/:id", isLogin, isAdmin, deleteAdminServices);

module.exports = router;
