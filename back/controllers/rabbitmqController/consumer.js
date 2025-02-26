const amqp = require("amqplib");
const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const {storeOrderInRedis, removeOrderFromRedis} = require("./storeOrderInRedis");
const {connectRabbitMQ} = require("../../config/rabbitMQ");
const {invalidateOnGoingOrdersCache} = require("../../utils/deleteRedisCache");
const {sendPushNotification} = require("../../utils/sendPushNotification");
const { consumeNewOrderMessages } = require("./consumeNeworder");



// 기본 주문 컨슈머
const consumeMessages = async (emitCancel, redisCli) => {
  try {
    const { channel } = await connectRabbitMQ();
    const cacheKey = `activeOrders`;
    const queue = "order_queue";
    const delayedExchange = "delayed_exchange";

    // 기본 큐 설정
    await channel.assertQueue(queue, { durable: true });

    // 지연 exchange 설정 (한 번만 선언)
    await channel.assertExchange(delayedExchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" }
    });

    console.log(`Waiting for messages in ${queue}`);

    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            const orderData = JSON.parse(msg.content.toString());
            console.log("Received order:", orderData);

            // DB 저장
            const order = new Order(orderData);
            await order.save();

            // Redis 저장 (30분 TTL)


            await storeOrderInRedis(redisCli, orderData);
            const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
            redisOrders.push(order);
            await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX: 18 }); // 3분 1분 테스트

            await invalidateOnGoingOrdersCache(order.userId,redisCli);

            // 소켓 전송
            //showOrderData(orderData);
            //emitCancel(orderData)

            await channel.publish(
              delayedExchange,
              "delayed_route.order", // 바인딩 시 사용한 라우팅 키
              Buffer.from(JSON.stringify({ orderId: order._id, type: "order"  })),
              { headers: { "x-delay": 18000 }, persistent: true } // 3분(180초 = 180,000ms) 1분 테스트
            );

            channel.ack(msg);
          } catch (error) {
            console.error("Error processing order:", error);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Consumer error:", error);
  }
};

// 지연 주문 처리 컨슈머
const consumeDelayedMessages = async (emitCancel,redisCli) => {
  try {
    const { channel } = await connectRabbitMQ();
    const delayedExchange = "delayed_exchange";
    const delayedQueue = "delayed_order_queue";

    // Exchange 재선언
    await channel.assertExchange(delayedExchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" }
    });

    // Queue 재선언
    await channel.assertQueue(delayedQueue, {
      durable: true,
    });

    // 라우팅 키에 따라 바인딩
    await channel.bindQueue(delayedQueue, delayedExchange, "delayed_route.order");
    await channel.bindQueue(delayedQueue, delayedExchange, "delayed_route.neworder");

    console.log(`Waiting for delayed messages in ${delayedQueue}`);

    channel.consume(
      delayedQueue,
      async (msg) => {
        if (msg) {
          console.log(`[DELAY RECEIVE] Raw 2: ${msg.content.toString()}`); // 🔼 수신 로그
          try {
            const { orderId, type } = JSON.parse(msg.content.toString());
            let order = null;
            let userId = null;

            if (type === "order") {
              order = await Order.findById(orderId);
            } else if (type === "neworder") {
              order = await NewOrder.findById(orderId);
            }

            if (order && order.status === "pending") {
              order.status = "cancelled";
              await order.save();
              userId = order.userId;
              await invalidateOnGoingOrdersCache(userId, redisCli);
              console.log(` Order ${orderId} cancelled automatically`);

              // 주문 취소 시 emitCancel 실행
              emitCancel({
                orderId: orderId,
                userId: userId,
                status: "cancelled",
                message: "Your order has been cancelled due to no acceptance."
              });
            }

            channel.ack(msg);
          } catch (error) {
            console.error("Error processing delayed order:", error);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Delayed consumer error:", error);
  }
};

module.exports = {
  consumeMessages,
  consumeDelayedMessages,
  consumeNewOrderMessages,
};