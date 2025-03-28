const amqp = require("amqplib");

let connection;
let channel;
let isConnecting = false; // 연결 중 플래그 추가

const connectRabbitMQ = async () => {
  // 이미 연결 중이면 대기
  while (isConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
  }

  // 이미 연결이 되어 있으면 기존 연결 반환
  if (connection && channel) {
    return { connection, channel };
  }

  isConnecting = true;
  try {
    if (!connection) {
      connection = await amqp.connect("amqp://rabbitmq:5672");
      console.log("✅ RabbitMQ 연결 성공!");

      // 연결 에러 핸들링
      connection.on("error", (err) => {
        console.error("RabbitMQ 연결 에러:", err);
        connection = null;
        channel = null;
      });

      // 연결 종료 시 재연결
      connection.on("close", () => {
        console.log("RabbitMQ 연결 종료, 재연결 시도...");
        connection = null;
        channel = null;
        setTimeout(connectRabbitMQ, 5000); // 5초 후 재연결 시도
      });
    }

    if (!channel) {
      channel = await connection.createChannel();
      console.log("✅ 채널 생성 성공!");

      // 채널 에러 핸들링
      channel.on("error", (err) => {
        console.error("RabbitMQ 채널 에러:", err);
        channel = null;
      });

      channel.on("close", () => {
        console.log("RabbitMQ 채널 종료");
        channel = null;
      });
    }

    return { connection, channel };
  } catch (error) {
    console.error("RabbitMQ 연결 실패:", error);
    connection = null;
    channel = null;
    throw error;
  } finally {
    isConnecting = false;
  }
};

module.exports = { connectRabbitMQ };