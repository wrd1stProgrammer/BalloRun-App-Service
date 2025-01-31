const amqp = require("amqplib");

let connection;
let channel;

const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    console.log("RabbitMQ 연결 성공!");
  }
  return { connection, channel };
};

module.exports = { connectRabbitMQ };
