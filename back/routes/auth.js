const express = require("express");
const {
    refreshToken,
    login,
    register,
    resetPassword,
    saveFcmToken,
} = require("../controllers/auth/auth");
const router = express.Router();

router.post("/refreshToken", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.post("/resetPw", resetPassword);
router.post("/saveFcmToken",saveFcmToken);
module.exports = router;



