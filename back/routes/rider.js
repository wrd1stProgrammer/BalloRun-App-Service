const express = require("express");
const {
  getOrderDataWithRedis
} = require("../controllers/rider/getOrderDataToRider");
const {
  acceptOrder
} = require("../controllers/rider/accetOrder");
const router = express.Router();

router.get('/getOrderData',getOrderDataWithRedis);
router.post(`/acceptOrder`,acceptOrder);
module.exports = router;