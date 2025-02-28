const amqp = require("amqplib");
const NewOrder = require("../../models/NewOrder");
const { storeOrderInRedis} = require("./storeOrderInRedis");
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { invalidateOnGoingOrdersCache } = require("../../utils/deleteRedisCache");
const { sendPushNotification } = require("../../utils/sendPushNotification");

const consumeNewOrderMessages = async (redisCli) => {
  try {
    const { channel } = await connectRabbitMQ();
    const cacheKey = `activeOrders`;
    const queue = "new_order_queue";
    const delayedExchange = "delayed_exchange";

    // 기본 큐 설정
    await channel.assertQueue(queue, { durable: true });

    // 지연 exchange 설정 (한 번만 선언)
    await channel.assertExchange(delayedExchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" }
    });
    console.log(`New Waiting for messages in ${queue}`);

    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            const orderData = JSON.parse(msg.content.toString());
            console.log("Received new order:", orderData);

            // DB 저장
            const newOrder = new NewOrder(orderData);
            await newOrder.save();
            
;

            //expectedTime api랑 컨슈머에 둘 다 적용하자

            // Redis 저장 (30분 TTL)
            // await storeOrderInRedis(redisCli, orderData);
            const transformedOrder = {
                _id: newOrder._id,
                name: newOrder.name,
                items: [
                  {
                    menuName: newOrder.orderDetails, // orderDetails 값을 menuName으로
                    cafeName: newOrder.name, // name 값을 cafeName으로
                  }
                ],
                deliveryType: newOrder.deliveryMethod,
                startTime: newOrder.startTime,
                deliveryFee: newOrder.deliveryFee,
                price: newOrder.priceOffer,
                createdAt: newOrder.createdAt,
                endTime: newOrder.endTime,
                lat: newOrder.lat,
                lng: newOrder.lng,
                resolvedAddress: newOrder.resolvedAddress,
                isReservation: newOrder.isReservation,
                orderType: newOrder.orderType,
              };
              

            const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
            redisOrders.push(transformedOrder);
            await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX: 120 }); // 3분 1분 테스트


            // 진행 주문 제거 이거 Ongoing에서 맞춰야 함.
            await invalidateOnGoingOrdersCache(orderData.userId, redisCli);

            

            await channel.publish(
              delayedExchange,
              "delayed_route.neworder", // 바인딩 시 사용한 라우팅 키
              Buffer.from(JSON.stringify({ orderId: newOrder._id , type: "neworder" })),
              { headers: { "x-delay": 120000 }, persistent: true } // 3분(180초 = 180,000ms) 1분 테스트
            );

            channel.ack(msg);
          } catch (error) {
            console.error("Error processing new order:", error);
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