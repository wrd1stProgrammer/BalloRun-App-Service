
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const amqp = require("amqplib");
const { connectRabbitMQ } = require("../../config/rabbitMQ");

const newOrderCreate = async (req, res) => {
  const {
    name,
    orderDetails,
    priceOffer,
    deliveryFee,
    riderRequest,
    images,
    orderImages,
    lat,
    lng,
    deliveryAddress,
    deliveryMethod,
    startTime,
    endTime,
    selectedFloor,
    resolvedAddress,
    usedPoints  
  } = req.body;

  const userId = req.user.userId;

  try {
    // 포인트 사용 시 유저 포인트 감소
    if (usedPoints > 0) {
      const user = await User.findById(userId);
      if (!user || user.point < usedPoints) {
        return res.status(400).json({ message: "포인트가 부족합니다." });
      }
      user.point -= usedPoints;
      await user.save();
    }

    // RabbitMQ 연결
    const { channel, connection } = await connectRabbitMQ();
    const queue = "new_order_queue";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({
      userId,
      name,
      orderDetails,
      priceOffer,
      deliveryFee,
      riderRequest,
      images,
      orderImages,
      lat,
      lng,
      deliveryAddress,
      deliveryMethod,
      startTime,
      endTime,
      selectedFloor,
      resolvedAddress,
      usedPoints // 메시지에 포함
    });

    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("큐에 전달-새로운 주문:", message);

    res.status(201).json({ message: "Order received and being processed." });

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