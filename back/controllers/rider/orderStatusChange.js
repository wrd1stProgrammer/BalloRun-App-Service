const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const { sendPushNotification } = require("../../utils/sendPushNotification");
const { invalidateOnGoingOrdersCache, invalidateCompletedOrdersCache } = require("../../utils/deleteRedisCache");

// 공통 소켓 이벤트 발송 함수
const emitOrderStatus = (req, order, status) => {
  const tossOrderStatus = req.app.get("tossOrderStatus");
  if (!tossOrderStatus) return;
  const userId = order.userId;
  if (!userId) return;
  const eventData = {
    status,
    userId,
    createdAt: order.createdAt,
    orderId: order._id,
  };
  tossOrderStatus(eventData);
  console.log(`Emitted order_${status} to user ${userId}:`, eventData);
};

const getOrderModel = (orderType) => {
  if (orderType === "Order") return Order;
  if (orderType === "NewOrder") return NewOrder;
  throw new Error("Invalid orderType. Must be 'Order' or 'NewOrder'");
};

// goToCafeHandler
const goToCafeHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: `${orderType} not found` });

    order.status = "goToCafe";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);
    emitOrderStatus(req, order, "goToCafe");

    // 주문자 알림 (가게로 이동)
    const orderUser = await User.findById(order.userId).select('fcmToken allOrderAlarm').lean();
    if (orderUser?.allOrderAlarm) {
      if (orderUser.fcmToken) {
        const notificationPayload = {
          title: "러너 픽업 중!",
          body: "러너가 구매를 위해 이동합니다. 배달 상태를 실시간으로 확인해보세요.",
          data: { type: "order_complete" },
        };
        try {
          await sendPushNotification(orderUser.fcmToken, notificationPayload);
          console.log(`주문자 ${order.userId}에게 알림 전송 성공 [goToCafe]`);
        } catch (notificationError) {
          console.error(`주문자 ${order.userId}에게 알림 전송 실패 [goToCafe]:`, notificationError);
        }
      } else {
        console.log(`주문자 ${order.userId}의 FCM 토큰이 없습니다. [goToCafe]`);
      }
    }

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

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: `${orderType} not found` });

    order.status = "makingMenu";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);
    emitOrderStatus(req, order, "makingMenu");

    // 주문자 알림 (픽업 완료)
    const orderUser = await User.findById(order.userId).select('fcmToken allOrderAlarm').lean();
    if (orderUser?.allOrderAlarm) {
      if (orderUser.fcmToken) {
        const notificationPayload = {
          title: "구매 완료!",
          body: "러너가 심부름 상품을 구매했습니다. 배달이 시작됩니다.",
          data: { type: "order_complete" },
        };
        try {
          await sendPushNotification(orderUser.fcmToken, notificationPayload);
          console.log(`주문자 ${order.userId}에게 알림 전송 성공 [makingMenu]`);
        } catch (notificationError) {
          console.error(`주문자 ${order.userId}에게 알림 전송 실패 [makingMenu]:`, notificationError);
        }
      } else {
        console.log(`주문자 ${order.userId}의 FCM 토큰이 없습니다. [makingMenu]`);
      }
    }

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

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: `${orderType} not found` });

    order.status = "goToClient";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);
    emitOrderStatus(req, order, "goToClient");

    // 주문자 알림 (고객에게 이동)
    const orderUser = await User.findById(order.userId).select('fcmToken allOrderAlarm').lean();
    if (orderUser?.allOrderAlarm) {
      if (orderUser.fcmToken) {
        const notificationPayload = {
          title: "배달 시작!",
          body: "러너가 주문지를 향해 이동합니다.",
          data: { type: "order_complete" },
        };
        try {
          await sendPushNotification(orderUser.fcmToken, notificationPayload);
          console.log(`주문자 ${order.userId}에게 알림 전송 성공 [goToClient]`);
        } catch (notificationError) {
          console.error(`주문자 ${order.userId}에게 알림 전송 실패 [goToClient]:`, notificationError);
        }
      } else {
        console.log(`주문자 ${order.userId}의 FCM 토큰이 없습니다. [goToClient]`);
      }
    }

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
    const userId = req.user.userId;
    const rideruser = await User.findById(userId);

    rideruser.isDelivering = false;

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: `${orderType} not found` });

    const deliveryFee = order.deliveryFee || 0;
    const originalMoney = order.priceOffer || 0;
    rideruser.originalMoney = (rideruser.originalMoney || 0) + originalMoney;
    rideruser.point = (rideruser.point || 0) + deliveryFee;
    order.status = "delivered";

    await order.save();
    await rideruser.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);
    await invalidateCompletedOrdersCache(order.userId, redisCli);
    emitOrderStatus(req, order, "delivered");

    // 주문자 알림 (배달 완료)
    const orderUser = await User.findById(order.userId).select('fcmToken allOrderAlarm').lean();
    if (orderUser?.allOrderAlarm) {
      if (orderUser.fcmToken) {
        const notificationPayload = {
          title: "배달이 완료되었습니다!",
          body: "배달 상태를 확인해 보시고 별점을 남겨주세요!.",
          data: { type: "order_complete" },
        };
        try {
          await sendPushNotification(orderUser.fcmToken, notificationPayload);
          console.log(`주문자 ${order.userId}에게 알림 전송 성공 [delivered]`);
        } catch (notificationError) {
          console.error(`주문자 ${order.userId}에게 알림 전송 실패 [delivered]:`, notificationError);
        }
      } else {
        console.log(`주문자 ${order.userId}의 FCM 토큰이 없습니다. [delivered]`);
      }
    }

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
