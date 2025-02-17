const express = require("express");
const {
  getOrderDataWithRedis,
  getroomId,
} = require("../controllers/rider/getOrderDataToRider");
const {
  acceptOrder,
  completeOrder
} = require("../controllers/rider/acceptOrder");
const { goToCafeHandler, makingMenuHandler, goToClientHandler } = require("../controllers/rider/orderStatusChange");
const router = express.Router();

router.get('/getOrderData',getOrderDataWithRedis);
router.post(`/acceptOrder`,acceptOrder);
router.post(`/acceptNewOrder`,);
router.post(`/completeOrder`,completeOrder);
router.post(`/getroomId`,getroomId);

router.post(`/goToCafeHandler`,goToCafeHandler);
router.post(`/makingMenuHandler`,makingMenuHandler);
router.post(`/goToClientHandler`,goToClientHandler);

module.exports = router;