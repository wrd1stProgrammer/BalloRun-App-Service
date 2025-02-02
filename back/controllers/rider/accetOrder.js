const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");
const {connectRabbitMQ} = require("../../config/rabbitMQ");

const acceptOrder = async (req, res) => {
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4; // Redis v4 
  const { orderId } = req.body; // 아이디 받아오기
  const riderId = req.user.userId; //라이더 아이디

  const lockKey = `lock:order:${orderId}`; // 주문별 락 키

  try {
    //1. Redis 락 설정 (동시 수락 방지)
    const lockAcquired = await redisCli.set(lockKey, riderId, { NX: true, EX: 10 });


    if (!lockAcquired) {
      return res.status(400).json({ message: "다른 배달자가 이미 주문을 수락하였습니다!!" });
    }

    await redisCli.expire(lockKey, 10); // 10초 후 락 자동 해제

    // 2. MongoDB에서 주문 상태 변경 (`pending` → `accepted`)
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "pending" }, //_id 유의!
      { $set: { status: "accepted", riderId } },
      { new: true }
    );

    if (!order) {
      await redisCli.del(lockKey); // 주문이 없으면 락 해제
      return res.status(400).json({ message: "주문이 없거나 이미 수락된 주문입니다!!" });
    }



    console.log(`Order ${orderId} removed from Redis`);

    // 4. RabbitMQ로 메시지 전송 (비동기 처리) -> 컨슈머에서 푸시알림,소켓클라업뎃,정산,채팅방웹소켓개설 등 추가 코딩 진행.
    const {channel,connection} = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    const queue = "order_accept_queue";

    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({ orderId, riderId, status: "accepted" });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(`Order ${orderId} sent to RabbitMQ`);

    //  5. 락 해제 (성공적으로 처리된 경우)
    await redisCli.del(lockKey);

    res.status(200).json({ message: "Order accepted successfully"});

  } catch (error) {
    console.error("Error accepting order:", error);

    // ❌ 오류 발생 시 락 해제 (예외 처리)
    await redisCli.del(lockKey);

    res.status(500).json({ message: "Failed to accept order" });
  }
};

module.exports = { acceptOrder };
