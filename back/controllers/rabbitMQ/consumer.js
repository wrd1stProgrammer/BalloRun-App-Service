const amqp = require("amqplib");
const Order = require("../../models/Order"); // 데이터베이스 모델
const cron = require("node-cron");


const consumeMessages = async (redisClient, showOrderData) => {
  try {
    // RabbitMQ 연결
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();
    // redis 연결
   //onst redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
    const cacheKey = `activeOrders`;
    
    // 클라에 줄 Socket 연결 코드
  //const showOrderData = req.app.get("showOrderData");

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

            // Redis에 저장
            const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
            redisOrders.push(order); // 기존 주문 데이터에 추가
            await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX: 1800 }); // TTL: 30분

            console.log("캐시된 Order 데이터 로그 :", redisOrders);
            
            // Socket 으로 Client 에 data 실시간 반영 (전체)
            showOrderData(orderData); // 여기 orderData 냐 order냐 ?? -> GPT 가 orderData 가 더 적합하다함

            console.log("db 저장 , redis 저장, socket 전송 성공!?");

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


  } catch (error) {
    console.error("Error in RabbitMQ consumer:", error);
  }
};

    // Node-cron 스케줄러: Redis TTL 확인 및 상태 업데이트
    cron.schedule("*/1 * * * *", async () => {
      console.log("만료된 Redis 데이터 체크 (1분 마다) ");
      const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
      const currentTime = Date.now();

      // 만료된 주문 처리
      const validOrders = [];
      for (const order of redisOrders) {
        if (new Date(order.startTime).getTime() + 30 * 60 * 1000 < currentTime) {
          // 30분이 지나면 상태를 matchFailed로 변경
          const dbOrder = await Order.findById(order._id); // order를 어디서 가져와 ? + ._id 냐 .orderId 냐?
          if (dbOrder.status === "pending") { // 하나 뺌.
            dbOrder.status = "matchFailed";
            await dbOrder.save();
            console.log(`Order ${dbOrder.orderId} 매치 실패`); // _id 를 orderId로 수정함.
          }
        } else {
          // 유효한 주문만 유지
          validOrders.push(order);
        }
      }

      // 만료된 주문이 있을 경우에만 Redis 갱신 -> Redis는 데이터 전체를 관리해서 특정 데이터만 삭제가 안돼(? 다른 방법 없을까)
      if (validOrders.length !== redisOrders.length) {
        await redisCli.set(cacheKey, JSON.stringify(validOrders)); // TTL 갱신 없이 저장
        console.log("Redis 업데이트 만료 데이터 없앰");
      }
    });

module.exports = {
  consumeMessages
};
// 소비자 실행
// consumeMessages();
