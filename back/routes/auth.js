const express = require("express");
const {
    refreshToken,
    login,
    register,
    resetPassword,
    saveFcmToken,
    kakaologin,
    
} = require("../controllers/auth/auth");
const router = express.Router();

const {sendEmail} = require("../controllers/auth/mailVerify"); // email
const { route } = require("./rider");

router.post("/refreshToken", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.post("/resetPw", resetPassword);
router.post("/saveFcmToken",saveFcmToken);
router.post("/kakaologin",kakaologin);

//mail router 
router.post("/verifyEamil",sendEmail);
module.exports = router;



