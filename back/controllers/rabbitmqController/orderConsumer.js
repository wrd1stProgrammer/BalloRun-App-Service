const amqp = require("amqplib");
const Order = require("../../models/Order");
const User = require("../../models/User");
const ChatRoom = require("../../models/ChatRoom"); // 채팅방 모델 추가
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const {sendPushNotification} = require("../../utils/sendPushNotification");
const {invalidateOnGoingOrdersCache} = require("../../utils/deleteRedisCache");


const consumeOrderAcceptQueue = async (redisCli, chatIo) => {
  try {
    const { channel } = await connectRabbitMQ();
    const queue = "order_accept_queue";

    await channel.assertQueue(queue, { durable: true });
    console.log(" orderConsumer 대기 중...");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const orderData = JSON.parse(msg.content.toString());
        console.log(" 진행 중인 주문 수락:", orderData);

        const { orderId, riderId } = orderData;

        try {
          // 1️주문 상태 업데이트 (ACID 보장)
          const order = await Order.findByIdAndUpdate(orderId, {
            status: "accepted",
            riderId,
          });

          if (!order) {
            console.error(` 주문 ${orderId} 찾을 수 없음.`);
            channel.nack(msg);
            return;
          }

          // 2️ 주문 요청자 ID 조회
          const userId = order.userId;

          const orderUser = await User.findById(userId);
          const riderUser = await User.findById(riderId); // 알람 일단 보려고 임시

          // 3️ 기존 1:1 채팅방 존재 여부 확인
          let chatRoom = await ChatRoom.findOne({
            users: { $all: [userId, riderId] },
          });

          if (!chatRoom) {
            // 4️ 채팅방 생성 (새 주문이므로 1:1 채팅방 필요)
            chatRoom = new ChatRoom({
              title: "더미 채팅 제목",
              users: [userId, riderId],
              orderId,
            });

            await chatRoom.save();
            console.log(` 새로운 1:1 채팅방 생성! 채팅방 ID: ${chatRoom._id}`);

            console.log(` 주문 ${orderId} -> 사용자 ${userId} 와 라이더 ${riderId} 채팅방 생성`);
          } else {
            console.log(` 기존 채팅방 사용 (${chatRoom._id})`);
          }

          // 푸쉬 알림 -> 배달매칭ㅇㅋ, 채팅 ㅇㅋ 
          const notipayload ={
            title: `배달요청이 수락되었습니다.`,
            body: `주문 현황을 조회하여 실시간으로 확인하세요!`,
            data: {type:"order_aceepted", orderId:orderId},
          }
          if (orderUser?.fcmToken) {
            //orderUser.fcmToken 로 변경해야함 잘 작동하면
            //await sendPushNotification(riderUser.fcmToken, notipayload);
          } else {
            console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
          }


          // 7️ Redis에서 해당 주문 제거 (배달이 수락됨)
          const cacheKey = "activeOrders";
          let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
          redisOrders = redisOrders.filter((order) => order._id.toString() !== orderId);
          await redisCli.set(cacheKey, JSON.stringify(redisOrders));

          await invalidateOnGoingOrdersCache(userId,redisCli);


          console.log(`🚀 Order ${orderId} removed from Redis`);

          channel.ack(msg);
        } catch (error) {
          console.error("❌ 주문 처리 중 오류 발생:", error);
        }
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ Consumer Error:", error);
  }
};

module.exports = { consumeOrderAcceptQueue };
