const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (chatIo) => {
  if (!chatIo) {
    console.error("Chat Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }

  //  채팅 소켓 연결 미들웨어 (토큰 인증)
  chatIo.use(async (socket, next) => {
    console.log("[ChatSocket] Middleware 실행 중...");
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("토큰이 없습니다."));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;
      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error("유효하지 않은 사용자입니다."));
      }
      next();
    } catch (err) {
      return next(new Error("토큰 검증 실패: " + err.message));
    }
  });

  // ✅ 채팅 연결 및 이벤트 설정
  chatIo.on("connection", (socket) => {
    console.log(`[ChatSocket] User ${socket.user.userId} connected`);

    // 사용자를 해당 채팅방에 참가시킴
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`[ChatSocket] ${socket.user.userId}가 채팅방 ${roomId}에 입장`);
    });

    // 클라이언트가 메시지를 보낼 때
    socket.on("sendMessage", (data) => {
      const { roomId, message } = data;
      console.log(`[ChatSocket] Message from ${socket.user.userId}:`, message);
      
      // 해당 채팅방의 모든 사용자에게 메시지 전달
      chatIo.to(roomId).emit("chatMessage", { userId: socket.user.userId, message });
    });

    socket.on("disconnect", () => {
      console.log(`[ChatSocket] User ${socket.user.userId} disconnected`);
    });
  });
};
