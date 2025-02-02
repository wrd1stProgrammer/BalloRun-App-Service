const amqp = require("amqplib");

let connection;

const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect("amqp://localhost:5672");
    console.log("✅ RabbitMQ 연결 성공!");
  }

  // 🚀 주문 요청마다 새로운 채널을 생성
  const channel = await connection.createChannel();
  return { connection, channel };
};

module.exports = { connectRabbitMQ };
