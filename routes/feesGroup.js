const express = require("express");
const isAdmin = require("../middlewares/isAdmin");
const FeesGroup = require("../models/FeesGroup");
const advancedResults = require("../middlewares/advancedResults");
const { isLogin } = require("../middlewares/isLogin");
const {
  createFeesGroup,
  getFeesGroup,
  getAllFeesGroup,
  updateFeesGroup,
  deleteFeesGroup,
} = require("../services/feesGroup");

const router = express.Router();
router
  .route("/")
  .post(isLogin, isAdmin, createFeesGroup)
  .get(isLogin, isAdmin, advancedResults(FeesGroup), getAllFeesGroup);

router
  .route("/:id")
  .get(isLogin, isAdmin, getFeesGroup)
  .put(isLogin, isAdmin, updateFeesGroup)
  .delete(isLogin, isAdmin, deleteFeesGroup);

module.exports = router;
