const express = require("express");
const {
  orderNowDirectCreate,
  matchRider,
} = require("../controllers/order/orderNowController");

const {
  getCompletedOrders,
  getOngoingOrders,
} = require("../controllers/order/orderPresent");

const router = express.Router();

router.post('/orderNow',orderNowDirectCreate);
router.post('/orderLater',);
// 
router.get('/getCompletedOrders',getCompletedOrders);
router.get('/getOngoingOreder',getOngoingOrders);


module.exports = router;