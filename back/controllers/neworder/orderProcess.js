const NewOrder =require("../../models/NewOrder");
const User = require("../../models/User");
const amqp = require("amqplib");
const {connectRabbitMQ} = require("../../config/rabbitMQ");

const newOrderCreate = async (req, res) => {
  const {
    name,
    orderDetails,
    priceOffer,
    deliveryTip,
    extraRequests,
    images,
    orderImages,
    latitude,
    longitude,
    deliveryMethod, // direct, nonContact
    pickupTime,
    deliveryAddress,
    pickupTimeDisplay, 
  } = req.body;

  const userId = req.user.userId; // authMiddleWare 에서 가져옴.

  try {
    // RabbitMQ 연결
    const { channel, connection } = await connectRabbitMQ();
    const queue = "new_order_queue";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({
      userId,
      name,
      orderDetails,
      priceOffer,
      deliveryTip,
      extraRequests,
      images,
      orderImages,
      latitude,
      longitude,
      deliveryMethod,
      pickupTime,
      deliveryAddress,
      pickupTimeDisplay,
    });

    // 메시지 큐에 전송
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("큐에 전달-새로운 주문:", message);

    // 클라이언트에 즉시 응답
    res.status(201).json({ message: "Order received and being processed." });

    // 연결 종료
    setTimeout(() => {
      channel.close();
    }, 1000);
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return res.status(500).json({ message: "주문 생성에 실패했습니다." });
  }
};

module.exports = {
  newOrderCreate,
};