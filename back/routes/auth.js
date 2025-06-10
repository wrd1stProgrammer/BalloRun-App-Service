const express = require("express");
const {
    refreshToken,
    login,
    register,
    resetPassword,
    saveFcmToken,
    kakaologin,
    applelogin,
    findIdByUserInfo,
    socialRegister,
} = require("../controllers/auth/auth");
const router = express.Router();

const {sendEmail} = require("../controllers/auth/mailVerify"); // email
const {checkNicknameApi,checkEmailApi,checkUserIdApi} = require("../controllers/auth/register");
const { route } = require("./rider");

router.post("/refreshToken", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.post("/resetPw", resetPassword);
router.post("/saveFcmToken",saveFcmToken);
router.post("/kakaologin",kakaologin);
router.post("/applelogin",applelogin);
router.post("/socialregister",socialRegister);
//mail router 
router.post("/verifyEmail",sendEmail);


//register
router.post("/checkNickname",checkNicknameApi);
router.post("/checkUserId",checkUserIdApi);
router.post("/checkEmail",checkEmailApi);

//id find, pw find
router.post("/findId",findIdByUserInfo);
router.post("resetpw");


module.exports = router;



