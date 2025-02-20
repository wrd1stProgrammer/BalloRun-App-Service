const express = require("express");
const {
  getOrderDataWithRedis,
  getroomId,
} = require("../controllers/rider/getOrderDataToRider");
const {
  acceptOrder,
  completeOrder
} = require("../controllers/rider/acceptOrder");
const {
  acceptNewOrder
} = require("../controllers/rider/acceptNewOrder");
const { goToCafeHandler, makingMenuHandler, goToClientHandler,completeOrderHandler } = require("../controllers/rider/orderStatusChange");
const router = express.Router();

router.get('/getOrderData',getOrderDataWithRedis);
router.post(`/acceptOrder`,acceptOrder);
router.post(`/acceptNewOrder`,acceptNewOrder);
router.post(`/completeOrder`,completeOrder);
router.post(`/getroomId`,getroomId);

router.post(`/goToCafeHandler`,goToCafeHandler);
router.post(`/makingMenuHandler`,makingMenuHandler);
router.post(`/goToClientHandler`,goToClientHandler);
router.post(`/completeOrderHandler`,completeOrderHandler);

module.exports = router;