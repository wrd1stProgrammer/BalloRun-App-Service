const express = require("express");
const dotenv = require("dotenv");
const redis = require("redis");
const socketIo = require("socket.io"); // Socket.IO
const http = require("http"); // HTTP 서버 모듈 추가
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const configureSocket = require("./loaders/socket"); // Socket.IO 설정 로더
const configureChatSocket = require("./loaders/chatSocket");
const configureMapSocket = require("./loaders/mapSocket");
const { consumeMessages } = require("./controllers/rabbitmqController/consumer");
const { consumeOrderAcceptQueue } = require("./controllers/rabbitmqController/orderConsumer");
const {fcmConnect } = require("./config/fcm");

dotenv.config();

async function startServer() {
  const app = express();

  // HTTP 서버 생성 (Express 앱 기반)
  const server = http.createServer(app);

  // Socket.IO 설정 (HTTP 서버에 연결)
  const io = socketIo(server, {
    cors: {
      origin: "*", // 모든 도메인 허용
      methods: ["GET", "POST"],
    },
  });




  //chatSocket.js
  const chatIo = io.of("/chat"); // 👉 `/chat` 네임스페이스 추가
  configureChatSocket(chatIo);




  // 실시간 지도 임시로 작업중!!!!!!!!!!!
  const locationIo = io.of("/location");
  configureMapSocket(locationIo)
  // 실시간 지도 임시로 작업중!!!!!!!!!!!





  // Socket.IO 설정 및 emit 함수 등록 -> 여기서 emit 할 거 여러가지 등록
  const { emitSocketTest, emitMatchTest, showOrderData } = configureSocket(io);
  app.set("emitSocketTest", emitSocketTest);
  app.set("emitMatchTest", emitMatchTest);
  app.set("showOrderData", showOrderData);


  // fcm server startt
  await fcmConnect(); // await 맞나


  // RabbitMQ 소비자 실행 (7초 딜레이)
  setTimeout(() => {
    console.log("10초 후에 RabbitMQ 소비자 실행 시작!");
    consumeMessages(showOrderData, redisCli);
    consumeOrderAcceptQueue(redisCli);
  }, 10000);


  // server,app -> loaders
  await require(".")(app, server);

  //* Redis 연결
  const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true, // 반드시 설정 !!
  });
  redisClient.on("connect", () => {
    console.info("Redis connected!");
  });
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
  await redisClient.connect().then(); // redis v4 연결 (비동기)
  app.set("redisClient", redisClient); // 클라이언트를 앱에 저장
  const redisCli = redisClient.v4; // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용
  // loaders 에 분리해도 됨.



  // 서버 리스닝 시작
  server
    .listen(5001, () => {
      console.log(`
      ################################################
      🛡️  서버 온 : ${app.get("port")} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
}
startServer();
