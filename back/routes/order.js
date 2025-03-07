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
  getDeliveryList,
  getDeliveryOngoingList,
} = require("../controllers/order/orderPresent");

const {
  getOnGoingNewOrders,
  getCompletedNewOrders,
  fetchOrderDetails,
  getBannerData,
  rateRiderStars,
} = require("../controllers/order/newOrderPresent");

const {
  getOrderDataForCancelApi,
  orderCancelApi,
} = require("../controllers/order/ordercancel")
const router = express.Router();

router.post('/orderNow',orderNowDirectCreate);
router.post('/orderLater',orderLaterDirectCreate);
// 
router.get('/getCompletedOrders',getCompletedOrders);
router.get('/getOngoingOrders',getOngoingOrders);
router.get('/getDeliveryList',getDeliveryList); // 완료주문
router.get('/getDeliveryOngoingList',getDeliveryOngoingList); //진행주문

router.get('/getNewOrderPresent',getOnGoingNewOrders);
router.get('/getNewCompletedOrderPresent',getCompletedNewOrders);
router.get('/getbannerdata',getBannerData);
router.post(`/raterider`,rateRiderStars);

router.post('/showOrderDetails',fetchOrderDetails);

router.post(`/getOrderDataForCancel`,getOrderDataForCancelApi);
router.post(`/cancelOrderAction`,orderCancelApi);



module.exports = router;