const express = require("express");
const {
  getOrderDataWithRedis,
  getroomId,
} = require("../controllers/rider/getOrderDataToRider");
const {
  acceptOrder,
  completeOrder
} = require("../controllers/rider/accetOrder");
const router = express.Router();

router.get('/getOrderData',getOrderDataWithRedis);
router.post(`/acceptOrder`,acceptOrder);
router.post(`/completeOrder`,completeOrder);
router.post(`/getroomId`,getroomId);

module.exports = router;