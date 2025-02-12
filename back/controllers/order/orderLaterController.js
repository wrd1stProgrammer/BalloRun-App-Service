const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");
const {connectRabbitMQ} = require("../../config/rabbitMQ");


const orderLaterDirectCreate = async (req, res) => {
  const { items, lat, lng, isMatch, deliveryFee, deliveryType, startTime, endTime, riderRequest, selectedFloor,price,quantity } = req.body;

  const userId = req.user.userId;
  const user = await User.findById(userId);
  

  try {
      // RabbitMQ 연결
      const {channel,connection} = await connectRabbitMQ();
      
      const queue = "order_queue";

      await channel.assertQueue(queue, { durable: true });

      // 메시지 생성
      const message = JSON.stringify({
          userId,
          items,
          lat,
          lng,
          isMatch,
          deliveryFee,
          deliveryType,
          startTime,
          endTime,
          riderRequest,
          selectedFloor,
          price,
          quantity
      });

      // 메시지 큐에 전송
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

      // console.log("큐에 전달달:", message);
  

      // 클라이언트에 즉시 응답
      res.status(201).json({ message: "Order received and being processed." });
            // 사용자 예약 상태 업데이트
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.isReservation = true;  // 예약 상태 변경
    await user.save();  // 변경 사항 저장


      // 연결 종료
      setTimeout(() => {
          channel.close();
      }, 1000);
  } catch (error) {
      console.error("Error in orderLaterDirectCreate:", error);
      res.status(500).json({ message: "Failed to process the order." });
  }

};


  module.exports = {
    orderLaterDirectCreate,
  };
  