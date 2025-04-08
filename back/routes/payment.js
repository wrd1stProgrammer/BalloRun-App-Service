const express = require("express");
const {
    completePayment
} = require("../controllers/payment/portone");

const router = express.Router();


router.post('/complete',completePayment);

module.exports = router;