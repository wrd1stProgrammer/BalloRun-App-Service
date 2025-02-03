const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");
const { connectRabbitMQ } = require("../../config/rabbitMQ");

const acceptOrder = async (req, res) => {
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4; // Redis v4 
  const { orderId } = req.body; // 주문 ID
  const riderId = req.user.userId; // 배달원 ID

  const lockKey = `lock:order:${orderId}`; // 주문별 락 키

  try {
    // 1. Redis 락 설정 (동시 수락 방지)
    const lockAcquired = await redisCli.set(lockKey, riderId, { NX: true, EX: 10 });

    if (!lockAcquired) {
      return res.status(400).json({ message: "다른 배달자가 이미 주문을 수락하였습니다!" });
    }

    await redisCli.expire(lockKey, 10); // 10초 후 락 자동 해제

    // 2. MongoDB에서 주문 상태 변경 (`pending` → `accepted`)
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "pending" },
      { $set: { status: "accepted", riderId } },
      { new: true }
    );

    if (!order) {
      await redisCli.del(lockKey); // 주문이 없으면 락 해제
      return res.status(400).json({ message: "주문이 없거나 이미 수락된 주문입니다!" });
    }

    // 3. 주문 정보를 Redis에 저장 (배달원-주문자 매핑)
    const customerUserId = order.customerId; // 주문자의 ID
    await redisCli.hSet(`order:${orderId}`, {
      riderId,
      customerUserId,
    });

    console.log(`Order ${orderId} saved in Redis for tracking`);

    // 4. RabbitMQ로 메시지 전송
    const { channel, connection } = await connectRabbitMQ();
    const queue = "order_accept_queue";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({ orderId, riderId, status: "accepted" });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(`Order ${orderId} sent to RabbitMQ`);

    // 5. 락 해제
    await redisCli.del(lockKey);

    // 6. 배달원이 수락하면 주문자에게 알림 전송 (MapSocket.js와 연동)
    const locationIo = req.app.get("locationIo"); // MapSocket.js의 locationIo 가져오기
    const customerSocketId = await redisCli.hGet(`user:${customerUserId}`, "socketId");

    if (customerSocketId) {
      locationIo.to(customerSocketId).emit("deliveryAccepted", { orderId, riderId });
    }

    res.status(200).json({ message: "Order accepted successfully" });

  } catch (error) {
    console.error("Error accepting order:", error);
    await redisCli.del(lockKey); // 오류 발생 시 락 해제
    res.status(500).json({ message: "Failed to accept order" });
  }
};

module.exports = { acceptOrder };


const styles = StyleSheet.create({
  backButton: {
      position: "absolute",
      top: 16,
      left: 16,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: 20,
      padding: 8,
      zIndex: 10,
  },
});