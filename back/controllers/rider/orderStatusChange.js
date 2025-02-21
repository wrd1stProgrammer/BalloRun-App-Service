const Order = require("../../models/Order");
const User = require("../../models/User");
const { sendPushNotification } = require("../../utils/sendPushNotification");
const { invalidateOnGoingOrdersCache } = require("../../utils/deleteRedisCache");

// 공통 소켓 이벤트 발송 함수
const emitOrderStatus = (req, order, status) => {
  const tossOrderStatus = req.app.get("tossOrderStatus");

  if (!tossOrderStatus) {
    console.warn("tossOrderStatus is not available");
    return;
  }

  const userId = order.userId; // NewOrder 모델에서 userId 가져오기
  if (!userId) {
    console.warn("User ID not found in order data");
    return;
  }

  const eventData = {
    status,
    userId,
    createdAt: order.createdAt,
    orderId: order._id,
  };

  tossOrderStatus(eventData);
  console.log(`Emitted order_${status} to user ${userId}:`, eventData);
};

// goToCafeHandler
const goToCafeHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "goToCafe"; // 상태 직접 지정
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    // 소켓 이벤트 발송
    emitOrderStatus(req, order, "goToCafe");

    res.status(200).json({ message: "Order status updated to goToCafe" });
  } catch (error) {
    console.error("Error in goToCafeHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// makingMenuHandler
const makingMenuHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "makingMenu"; // 상태 직접 지정
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    // 소켓 이벤트 발송
    emitOrderStatus(req, order, "makingMenu");

    res.status(200).json({ message: "Order status updated to makingMenu" });
  } catch (error) {
    console.error("Error in makingMenuHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// goToClientHandler
const goToClientHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "goToClient"; // 상태 직접 지정
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    // 소켓 이벤트 발송
    emitOrderStatus(req, order, "goToClient");

    res.status(200).json({ message: "Order status updated to goToClient" });
  } catch (error) {
    console.error("Error in goToClientHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// completeOrderHandler
const completeOrderHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "delivered"; // 상태 직접 지정
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    // 소켓 이벤트 발송
    emitOrderStatus(req, order, "delivered");

    res.status(200).json({ message: "Order status updated to delivered" });
  } catch (error) {
    console.error("Error in completeOrderHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  goToCafeHandler,
  makingMenuHandler,
  goToClientHandler,
  completeOrderHandler,
};