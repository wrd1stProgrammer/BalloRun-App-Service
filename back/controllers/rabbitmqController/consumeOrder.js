const amqp = require("amqplib");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const { storeOrderInRedis } = require("./storeOrderInRedis");
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { invalidateOnGoingOrdersCache } = require("../../utils/deleteRedisCache");
const { sendPushNotification } = require("../../utils/sendPushNotification");


const consumeNewOrderMessages = async (redisCli) => {
    try {
      const { channel } = await connectRabbitMQ();
      const cacheKey = `activeOrders`;
      const queue = "new_order_queue";
      const delayedExchange = "delayed_exchange";
      const deadLetterExchange = "dead_letter_exchange";
      const deadLetterQueue = "dead_letter_queue";
  
      // Dead-Letter Exchange와 Queue 설정
      await channel.assertExchange(deadLetterExchange, "direct", { durable: true });
      await channel.assertQueue(deadLetterQueue, { durable: true });
      await channel.bindQueue(deadLetterQueue, deadLetterExchange, deadLetterQueue);
  
      // 원래 큐에 DLX 설정 추가
      await channel.assertQueue(queue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": deadLetterExchange,
          "x-dead-letter-routing-key": deadLetterQueue,
        },
      });
  
      await channel.assertExchange(delayedExchange, "x-delayed-message", {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
      });
      console.log(`New Waiting for messages in ${queue}`);
  
      channel.consume(
        queue,
        async (msg) => {
          if (msg) {
            try {
              const orderData = JSON.parse(msg.content.toString());
              console.log("Received new order:", orderData);
  
              const newOrder = new NewOrder({
                ...orderData,
                usedPoints: orderData.usedPoints || 0,
              });
              await newOrder.save();
  
              const transformedOrder = {
                _id: newOrder._id,
                name: newOrder.name,
                items: [{ menuName: newOrder.orderDetails, cafeName: newOrder.name }],
                deliveryType: newOrder.deliveryMethod,
                startTime: newOrder.startTime,
                deliveryFee: newOrder.deliveryFee,
                price: newOrder.priceOffer,
                createdAt: newOrder.createdAt,
                endTime: newOrder.endTime,
                lat: newOrder.lat,
                lng: newOrder.lng,
                resolvedAddress: newOrder.resolvedAddress,
                deliveryAddress: newOrder.deliveryAddress,
                selectedFloor: newOrder.selectedFloor,
                isReservation: newOrder.isReservation,
                orderType: newOrder.orderType,
                usedPoints: newOrder.usedPoints,
              };
  
              const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
              redisOrders.push(transformedOrder);
              await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX: 120 });
  
              await invalidateOnGoingOrdersCache(orderData.userId, redisCli);
  
              await channel.publish(
                delayedExchange,
                "delayed_route.neworder",
                Buffer.from(JSON.stringify({ orderId: newOrder._id, type: "neworder" })),
                { headers: { "x-delay": 120000 }, persistent: true }
              );
  
              channel.ack(msg);
            } catch (error) {
                console.error("Error processing new order:", error);

                // 사용자에게 푸시 알림 전송
                try {
                  const orderData = JSON.parse(msg.content.toString());
                  const user = await User.findById(orderData.userId);
                  if (user?.fcmToken) {
                    const notipayload = {
                      title: `주문 처리 실패`,
                      body: `주문 처리에 문제가 발생했습니다. 다시 시도해주세요`,
                      data: { type: "order_failed", Id: orderData._id},
                    };
                    await sendPushNotification(user.fcmToken, notipayload);
                    console.log(`사용자 ${orderData.userId}에게 주문 처리 실패 알림 전송 완료`);
                  } else {
                    console.log(`사용자 ${orderData.userId}의 FCM 토큰이 없습니다.`);
                  }
                } catch (notificationError) {
                  console.error("푸시 알림 전송 실패:", notificationError);
                }
    
                channel.nack(msg, false, false); // 오류 시 메시지를 DLX로 보냄
            }
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("New order consumer error:", error);
    }
  };


  module.exports = {
    consumeNewOrderMessages,
  };