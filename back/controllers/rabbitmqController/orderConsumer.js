const amqp = require("amqplib");
const Order = require("../../models/Order");
const {connectRabbitMQ} = require("../../config/rabbitMQ");

const consumeOrderAcceptQueue = async (redisCli) => {
  try {
    const { channel } = await connectRabbitMQ();
    const queue = "order_accept_queue";

    await channel.assertQueue(queue, { durable: true });
    console.log("orderConsumer 대기 완료");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const orderData = JSON.parse(msg.content.toString());
        console.log("진행중인 수락 주문:", orderData);

        const { orderId, riderId } = orderData;

        try {
          // 1. 주문 상태 최종 업데이트 (ACID 보장)
          await Order.findByIdAndUpdate(orderId, {
            status: "accepted",
            riderId,
          });
          // cacheKey가 스트링이라 전부를 가져와 수정해 업데이트 방식으로 해야 함. 레디스에 주문 정보를 저장하니 
          try {
            const cacheKey = "activeOrders";
          
            // Redis에서 현재 주문 목록 가져오기
            let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
          
            // 주문 리스트에서 해당 orderId 제거
            //redisOrders = redisOrders.filter(order => order.orderId !== orderId);
            redisOrders = redisOrders.filter(order => order._id.toString() !== orderId);

            // 업데이트된 리스트를 Redis에 다시 저장
            await redisCli.set(cacheKey, JSON.stringify(redisOrders));
          
            console.log(`🚀 Order ${orderId} removed from Redis`);
          } catch (error) {
            console.error(`❌ Redis Remove Error for Order ${orderId}:`, error);
          }

          channel.ack(msg);
        } catch (error) {
          console.error("❌ Error processing order:", error);
        }
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ Consumer Error:", error);
  }
};

module.exports = {
  consumeOrderAcceptQueue,
};