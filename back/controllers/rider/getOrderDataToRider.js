const Order = require("../../models/Order");
const User = require("../../models/User");
const ChatRoom = require("../../models/ChatRoom");
const amqp = require("amqplib");
const {invalidateCompletedOrdersCache} = require("../../utils/deleteRedisCache");

const getOrderDataWithRedis = async (req, res) => {
    try {
      // Redis 클라이언트 가져오기
      const redisClient = req.app.get("redisClient");
      const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
  
      const cacheKey = `activeOrders`;
  
      // Redis에서 주문 데이터 가져오기
      const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
  
      if (redisOrders.length > 0) {
        // Redis 데이터 반환
        console.log("Redis에서 데이터 반환");
        return res.status(200).json({
          success: true,
          orders: redisOrders,
        });
      } else {
        // redis 에 데이터 없음 , 즉 아무런 order 데이터가 없음
        console.log("요청 중인 주문 데이터 없음");
        return res.status(404).json({
          success: false,
          message: "요청된 주문이 없습니다.",
        });
      }
    } catch (error) {
      console.error("Error in getOrderDataWithRedis:", error);
      return res.status(500).json({
        success: false,
        message: "주문 데이터를 가져오는 중 오류가 발생했습니다.",
      });
    }
  };

  const getroomId = async (req, res) => {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId).exec();

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "delivered";
        order.save();

        await invalidateCompletedOrdersCache(order.userId,redisCli);

        const { userId, riderId } = order;

        const chatRoom = await ChatRoom.findOne({
          users: { $all: [userId, riderId] },
      }).lean();

        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        res.status(200).json({ roomId: chatRoom._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
  
  module.exports = {
    getOrderDataWithRedis,
    getroomId,
  };