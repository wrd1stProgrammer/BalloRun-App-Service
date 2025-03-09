const amqp = require("amqplib");
const NewOrder = require("../../models/NewOrder");
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

    await channel.assertQueue(queue, { durable: true });

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

            // DB 저장 (usedPoints 포함)
            const newOrder = new NewOrder({
              ...orderData,
              usedPoints: orderData.usedPoints || 0 // 기본값 0
            });
            await newOrder.save();

            const transformedOrder = {
              _id: newOrder._id,
              name: newOrder.name,
              items: [
                {
                  menuName: newOrder.orderDetails,
                  cafeName: newOrder.name,
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
              usedPoints: newOrder.usedPoints // Redis에도 반영 (선택적)
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