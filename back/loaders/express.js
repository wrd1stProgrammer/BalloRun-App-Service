// loaders/express.js
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io"); // socket.io Server 클래스

module.exports = async (app, server) => {
  // server 추가
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan("dev"));

  // Socket.IO 연결 설정
  const io = new Server(server, {
    cors: {
      origin: "*", // 프론트엔드 서버의 origin 설정
      methods: ["GET", "POST"],
      transports: ["websocket"], // websocket을 통해 연결
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // 다른 모듈에서 사용할 수 있게 io 객체를 app에 저장
  app.set("io", io);

  console.log("Express  설정 완료");
};
