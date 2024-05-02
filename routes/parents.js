const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const { isParentLogin } = require("../middlewares/isParentLogin");
const { isLogin } = require("../middlewares/isLogin");
const isParent = require("../middlewares/isParent");
const advancedResults = require("../middlewares/advancedResults");
const Parents = require("../models/Parents");
const {
  adminRegisterParents,
  loginParents,
  getAllParentsAdmin,
  getParentsByAdmin,
  getParentsProfile,
   adminUpdateParents,
} = require("../services/parentsServices");

const router = express.Router();
router.route("/admins/register").post(isLogin, isAdmin, adminRegisterParents);

router.route("/login").post(loginParents);

router.route("/admin").get(
  isLogin,
  isAdmin,
  getAllParentsAdmin
);
router.route("/:parentID/admin").get(isLogin, isAdmin, getParentsByAdmin);
router.route("/profile").get(isParentLogin, isParent, getParentsProfile);

 
router.route("/:parentID/admin").put(isLogin, isAdmin, adminUpdateParents);

module.exports = router;
 