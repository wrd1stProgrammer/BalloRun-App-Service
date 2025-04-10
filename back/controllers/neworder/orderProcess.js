const mongoose = require("mongoose");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { sendPushNotification } = require("../../utils/sendPushNotification");

const newOrderCreate = async (req, res) => {
  const {
    paymentId, // 추가: 결제 ID를 클라이언트에서 전달받음
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
    usedPoints,
  } = req.body;

  const userId = req.user.userId;

  // // 필수 필드 검증
  // const requiredFields = ["name", "orderDetails", "priceOffer", "deliveryFee", "deliveryAddress"];
  // for (const field of requiredFields) {
  //   if (!req.body[field]) {
  //     return res.status(400).json({ message: `${field} 필드가 누락되었습니다.` });
  //   }
  // }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 포인트 사용 시 유저 포인트 감소
    if (usedPoints > 0) {
      if (user.point < usedPoints) {
        await session.abortTransaction();
        return res.status(400).json({ message: "포인트가 부족합니다." });
      }
      user.point -= usedPoints;
      await user.save({ session });
      console.log(`사용자 ${userId}의 포인트 ${usedPoints} 차감 완료`);
    }

    // 주문 생성
    const message = JSON.stringify({
      paymentId,
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
      selectedFloor,
      startTime,
      endTime,
      selectedFloor,
      resolvedAddress,
      usedPoints // 메시지에 포함
    });

    // RabbitMQ 메시지 전송
    const { channel } = await connectRabbitMQ();
    const queue = "new_order_queue";
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "dead_letter_exchange",
        "x-dead-letter-routing-key": "dead_letter_queue",
      },
    });

    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });


    await session.commitTransaction();
    session.endSession();

    // 푸시 알림 전송
    try {
      const notipayload = {
        title: `배달요청이 완료되었습니다.`,
        body: `주문 현황을 조회하여 실시간으로 확인하세요!`,
        data: { type: "order_accepted", Id: userId },
      };
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, notipayload);
        console.log(`사용자 ${userId}에게 푸시 알림 전송 완료`);
      } else {
        console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
      }
    } catch (error) {
        console.error("푸시 알림 전송 실패:", error);
    }

    res.status(201).json({ message: "Order received and being processed." });
  } catch (error) {
    // 트랜잭션이 아직 커밋되지 않은 경우에만 abort 호출
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("주문 생성 실패:", error);
    return res.status(500).json({ message: "주문 생성에 실패했습니다." });
  }
};

module.exports = {
  newOrderCreate,
};