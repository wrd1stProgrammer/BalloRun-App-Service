const express = require("express");
const {
  getProfile,
  updateProfile,
  saveVerification,
} = require("../controllers/auth/user");

const router = express.Router();

router.route("/profile").get(getProfile).patch(updateProfile);
router.post(`/saveVerification`,saveVerification);
module.exports = router;