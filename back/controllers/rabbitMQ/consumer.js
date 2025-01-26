const amqp = require("amqplib");
const Order = require("../../models/Order"); // 데이터베이스 모델
const {storeOrderInRedis} = require("../rabbitMQ/storeOrderInRedis");

const consumeMessages = async ( showOrderData,redisSubClient,redisCli) => {
  try {
    // RabbitMQ 연결
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const cacheKey = `activeOrders`;
    const queue = "order_queue";

    // 큐 선언
    await channel.assertQueue(queue, { durable: true });

    console.log(`대기 중인 queue: ${queue}`);

    // 큐에서 메시지 소비
    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          try {
            // 메시지 처리
            const orderData = JSON.parse(msg.content.toString());
            console.log("Received order:", orderData);

            // 주문 데이터 데이터베이스에 저장
            const order = new Order(orderData);
            await order.save();

            // Redis에 주문 개별 저장
            await storeOrderInRedis(redisCli, orderData);

            // Redis에 저장
            const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
            redisOrders.push(order); // 기존 주문 데이터에 추가
            await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX:600000});//L: 5분

            console.log("캐시된 Order 데이터 로그:", redisOrders);

            // Socket으로 Client에 data 실시간 반영
            showOrderData(orderData);

            console.log("DB 저장, Redis 저장, Socket 전송 성공!");

            // 메시지 처리 완료 (acknowledge)
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            // 메시지 재처리를 위해 ack를 호출하지 않음
          }
        }
      },
      { noAck: false } // 메시지가 처리된 경우에만 삭제
    );

    // Redis Keyspace Notifications 구독
    redisSubClient.subscribe("__keyevent@0__:expired", (err) => {
      if (err) {
        console.error("Redis Keyspace Notifications 구독 실패:", err);
      } else {
        console.log("Redis Keyspace Notifications 구독 성공!");
      }
    });

    // 만료된 Redis 키 처리
    redisSubClient.on("message", async (channel, key) => {
      if (channel === "__keyevent@0__:expired" && key.startsWith("order:")) {
        console.log(`Expired order key detected: ${key}`);

        try {
          // 만료된 키에서 orderId 추출
          const orderId = key.split(":")[1];
          const dbOrder = await Order.findById(orderId);
          if (dbOrder && dbOrder.status === "pending") {
            dbOrder.status = "matchFailed";
            await dbOrder.save();
            console.log(`Order ${dbOrder._id} 매치 실패로 상태 업데이트.`);
          }
        } catch (err) {
          console.error("Expired order 처리 중 오류:", err);
        }
      }
    });

  } catch (error) {
    console.error("Error in RabbitMQ consumer:", error);
  }
};

module.exports = {
  consumeMessages,
};
