const amqp = require("amqplib");

let connection;
let channel; // 채널을 전역 변수

const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect("amqp://rabbitmq:5672");
    console.log("✅ RabbitMQ 연결 성공!");
  }
  if (!channel) {
    channel = await connection.createChannel();
    console.log("✅ 채널 생성 성공!");
  }

  return { connection, channel };
};

module.exports = { connectRabbitMQ };