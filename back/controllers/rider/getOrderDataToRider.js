const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");

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
  
  module.exports = {
    getOrderDataWithRedis,
  };