
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const amqp = require("amqplib");
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { sendPushNotification } = require("../../utils/sendPushNotification");

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
    const user = await User.findById(userId);
    // 포인트 사용 시 유저 포인트 감소
    if (usedPoints > 0) {
      //const user = await User.findById(userId);
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

          // 푸쉬알림 테스트
          const notipayload = {
            title: `배달요청이 완료되었습니다.`,
            body: `주문 현황을 조회하여 실시간으로 확인하세요!`,
            data: { type: "order_accepted", orderId: userId },
          };
          // 주문한 사용자의 토큰.
          if (user?.fcmToken) {
            console.log('수정로그');
            await sendPushNotification(user.fcmToken, notipayload);
          } else {
            console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
          }

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