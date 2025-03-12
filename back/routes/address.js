const express = require('express');
const { addAddress, getUserAddresses, updateAddress, deleteAddress } = require('../controllers/address/addaddress');

const router = express.Router();

router.post('/add', addAddress);
router.get('/list/:userId', getUserAddresses); // 주소 목록 조회
router.put('/:addressId', updateAddress); // 주소 업데이트
router.delete('/:addressId', deleteAddress); // 주소 삭제

module.exports = router;