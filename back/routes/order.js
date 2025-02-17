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
  getDeliveryList
} = require("../controllers/order/orderPresent");

const {
  getOnGoingNewOrders,
  getCompletedNewOrders
} = require("../controllers/order/newOrderPresent");



const router = express.Router();

router.post('/orderNow',orderNowDirectCreate);
router.post('/orderLater',orderLaterDirectCreate);
// 
router.get('/getCompletedOrders',getCompletedOrders);
router.get('/getOngoingOrders',getOngoingOrders);
router.get('/getDeliveryList',getDeliveryList);

router.get('/getNewOrderPresent',getOnGoingNewOrders);
router.get('/getNewCompletedOrderPresent',getCompletedNewOrders);


module.exports = router;