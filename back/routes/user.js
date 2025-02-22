const express = require("express");
const {
  getProfile,
  updateProfile,
  saveVerification,
  registerAccountApi,
  withdrawApi,
  getWithdrawList
} = require("../controllers/auth/user");

const router = express.Router();

router.route("/profile").get(getProfile).patch(updateProfile);
router.post(`/saveVerification`,saveVerification);
router.post(`/registeraccount`,registerAccountApi);
router.post(`/withdraw`,withdrawApi);
router.get(`/getwithdrawlist`,getWithdrawList);
module.exports = router;