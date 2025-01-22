const amqp = require("amqplib");
const Order = require("../../models/Order"); // 데이터베이스 모델

const consumeMessages = async () => {
  try {
    // RabbitMQ 연결
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();

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

            // 예: 주문 데이터 데이터베이스에 저장
            const order = new Order(orderData);
            await order.save();
            console.log("Order saved to database");

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

module.exports = {
  consumeMessages
};
// 소비자 실행
consumeMessages();
