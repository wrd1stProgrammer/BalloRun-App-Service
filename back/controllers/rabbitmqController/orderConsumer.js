const amqp = require("amqplib");
const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder"); // NewOrder 모델 추가
const User = require("../../models/User");
const ChatRoom = require("../../models/ChatRoom"); // 채팅방 모델 추가
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { sendPushNotification } = require("../../utils/sendPushNotification");
const { invalidateOnGoingOrdersCache } = require("../../utils/deleteRedisCache");

const consumeOrderAcceptQueue = async (redisCli, chatIo) => {
  try {
    const { channel } = await connectRabbitMQ();
    const queue = "order_accept_queue";
    // 동일한 설정으로 큐 선언
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "dead_letter_exchange",
        "x-dead-letter-routing-key": "dead_letter_queue",
      },
    });
    console.log("orderConsumer 대기 중...");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const orderData = JSON.parse(msg.content.toString());
        console.log("진행 중인 주문 수락:", orderData);

        const { orderId, riderId, orderType } = orderData; // orderType 추가

        try {
          let order;

          // 1️⃣ 주문 타입에 따라 다른 모델 사용
          if (orderType === "Order") {
            order = await Order.findByIdAndUpdate(orderId, {
              status: "accepted",
              riderId,
            });
          } else if (orderType === "NewOrder") {
            order = await NewOrder.findByIdAndUpdate(orderId, {
              status: "accepted",
              riderId,
            });
          } else {
            console.error(`잘못된 주문 타입: ${orderType}`);
            channel.nack(msg);
            return;
          }

          if (!order) {
            console.error(`주문 ${orderId} 찾을 수 없음.`);
            channel.nack(msg);
            return;
          }

          // 2️⃣ 주문 요청자 ID 조회
          const userId = order.userId;

          const orderUser = await User.findById(userId);
          const riderUser = await User.findById(riderId); // 알람 일단 보려고 임시
          console.log('수락에서 riderUser', riderUser);
          riderUser.isDelivering = true;
          riderUser.exp = (riderUser.exp || 0) + 10;
          
          await riderUser.save();
          console.log('riderUser UPdate',riderUser);

          // 3️⃣ 기존 1:1 채팅방 존재 여부 확인
          let chatRoom = await ChatRoom.findOne({
            users: { $all: [userId, riderId] },
          });

          if (!chatRoom) {
            // 4️⃣ 채팅방 생성 (새 주문이므로 1:1 채팅방 필요)
            chatRoom = new ChatRoom({
              title: "채팅방",
              users: [userId, riderId],
              orderId,
            });

            await chatRoom.save();
            console.log(`새로운 1:1 채팅방 생성! 채팅방 ID: ${chatRoom._id}`);

            console.log(`주문 ${orderId} -> 사용자 ${userId} 와 라이더 ${riderId} 채팅방 생성`);
          } else {
            console.log(`기존 채팅방 사용 (${chatRoom._id})`);
          }

          // 5️⃣ 푸쉬 알림 -> 배달매칭 완료, 채팅방 생성 알림
          if(orderUser.allOrderAlarm){
            const notipayload = {
              title: `배달요청이 수락되었습니다.`,
              body: `주문 현황을 조회하여 실시간으로 확인하세요!`,
              data: { type: "order_accepted" },
            };
  
            if (orderUser?.fcmToken) {
              // orderUser.fcmToken로 변경해야 함
              await sendPushNotification(orderUser.fcmToken, notipayload);
            } else {
              console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
            }
          }

          // 6️⃣ Redis에서 해당 주문 제거 (배달이 수락됨)
          const cacheKey = "activeOrders";
          let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
          redisOrders = redisOrders.filter((order) => order._id.toString() !== orderId);
          await redisCli.set(cacheKey, JSON.stringify(redisOrders));

          await invalidateOnGoingOrdersCache(userId, redisCli);

          console.log(`🚀 Order ${orderId} removed from Redis`);

          channel.ack(msg);
        } catch (error) {
          console.error("❌ 주문 처리 중 오류 발생:", error);

          // 라이더에게 푸시 알림 전송
          try {
            const riderUser = await User.findById(riderId);
            if (riderUser?.fcmToken) {
              const notipayload = {
                title: "주문 수락 처리 실패",
                body: "주문 수락 처리에 실패했습니다. 다시 시도해주세요.",
                data: { type: "order_accept_failed" },
              };
              await sendPushNotification(riderUser.fcmToken, notipayload);
              console.log(`라이더 ${riderId}에게 주문 수락 실패 알림 전송 완료`);
            } else {
              console.log(`라이더 ${riderId}의 FCM 토큰이 없습니다.`);
            }
          } catch (notificationError) {
            console.error("푸시 알림 전송 실패:", notificationError);
          }

          channel.nack(msg, false, false); // 실패한 메시지를 DLX로 이동
        }
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ Consumer Error:", error);
  }
};

module.exports = { consumeOrderAcceptQueue };