const express = require("express");
const {
  getOrderDataWithRedis
} = require("../controllers/rider/getOrderDataToRider");

const router = express.Router();

router.get('/getOrderData',getOrderDataWithRedis);

module.exports = router;