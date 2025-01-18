const express = require("express");
const {
  orderNowDirectCreate,
  matchRider,
} = require("../controllers/order/orderNowController");

const {
  orderLaterDirectCreate,
} = require("../controllers/order/orderLaterController");

const {
  getCompletedOrders,
  getOngoingOrders,
} = require("../controllers/order/orderPresent");

const router = express.Router();

router.post('/orderNow',orderNowDirectCreate);
router.post('/orderLater',orderLaterDirectCreate);
// 
router.get('/getCompletedOrders',getCompletedOrders);
router.get('/getOngoingOrders',getOngoingOrders);


module.exports = router;