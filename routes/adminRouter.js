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

// routes

//admin register
router.post("/register", registerAdminServices);
  
//login
router.post("/login", loginAdminServices);

// get all admin

router.get("/", isLogin,getAdminsServices);
 
//profile

router.get("/profile", isLogin,isAdmin, getAdminProfileServices);
 
// update admin
router.put("/:id",updateAdminServices);
// delete admin
router.delete("/:id", deleteAdminServices);
  
module.exports = router;
