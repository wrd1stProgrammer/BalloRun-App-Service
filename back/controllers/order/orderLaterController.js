const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");
const {consumeMessages}= require("../rabbitmqController/consumer");


const orderLaterDirectCreate = async (req, res) => {
  const { items, lat, lng, isMatch, deliveryFee, deliveryType, startTime, endTime, riderRequest, selectedFloor } = req.body;

  const userId = req.user.userId;
  

  try {
      // RabbitMQ 연결
      const connection = await amqp.connect("amqp://rabbitmq:5672");
      const channel = await connection.createChannel();
      
      
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
      });

      // 메시지 큐에 전송
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

      console.log("큐에 전달달:", message);

      // 클라이언트에 즉시 응답
      res.status(201).json({ message: "Order received and being processed." });

      // 연결 종료
      setTimeout(() => {
          channel.close();
          connection.close();
      }, 1000);
  } catch (error) {
      console.error("Error in orderLaterDirectCreate:", error);
      res.status(500).json({ message: "Failed to process the order." });
  }

};


  module.exports = {
    orderLaterDirectCreate,
  };
  