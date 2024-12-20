const express = require("express");
const {
    refreshToken
} = require("../controllers/auth/auth");
const router = express.Router();

router.post("/refreshToken", refreshToken);



module.exports = router;



