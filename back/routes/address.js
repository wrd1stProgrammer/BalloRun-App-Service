const express = require('express');
const { addAddress, getUserAddresses } = require('../controllers/address/addaddress');

const router = express.Router();

router.post('/add', addAddress);
router.get('/list/:userId', getUserAddresses); // 주소 목록 조회

module.exports = router;