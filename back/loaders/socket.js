const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User 모델 import

module.exports = (io) => {
  if (!io) {
    console.error("Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }
  const userSocketMap = new Map();

  io.use(async (socket, next) => {
    console.log("Socket.IO Middleware 작동 중...");
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("client 에서 token 못 가져옴. (1)"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;

      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error("User not found"));
      }

      // socket.user.username = user.username; // username 추가 -> 필요없을 듯.?
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("토큰이 만료되었습니다.");
        return next(new Error("Authentication error: Token expired"));
      } else {
        console.log("유효하지 않은 토큰입니다.");
        return next(new Error("Authentication error: Invalid token"));
      }
    }
  });

  // 소켓 연결
  io.on("connection", (socket) => {
    console.log(`${socket.user.userId} 연결되었습니다.`);

    // 연결 시 userId와 socket.id 매핑
    const userId = socket.user.userId.toString(); // ObjectId → 문자열 변환
    userSocketMap.set(userId, socket.id);
    console.log(`매핑 추가: ${userId} -> ${socket.id}`);


    //필요 없을듯 일단 유지
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`${userId}가 방에 조인함`);
      // 방에 속한 소켓 목록 확인
      const rooms = io.sockets.adapter.rooms.get(userId);
      console.log(`방 ${userId}에 속한 소켓 수: ${rooms ? rooms.size : 0}`);
    });
  
    const userRoom = socket.user.userId;
    socket.join(userRoom);
    console.log(`자동 조인: ${userRoom}`);

    socket.on("disconnect", () => {
      console.log(`${socket.user.userId} 연결 해제됨.`); // 기존
      userSocketMap.delete(userId);
      console.log(`${userId} 연결 해제됨. 매핑 제거`);
    });

      // 배달 완료 이벤트 처리 → 주문자(userId)에게 전달
      socket.on("order_completed", ({ orderId, userId }) => {
        if (!userId) {
            console.error("❌ 주문자의 userId가 전달되지 않음!");
            return;
        }

        console.log(`🚀 배달 완료 이벤트 수신 -> 주문자 ${userId}에게 전달`);

        // 주문자에게만 배달 완료 이벤트 전송
        io.to(userId).emit("order_completed", { orderId });
        //io.to(riderId).emit("order_completed", { orderId });

        console.log(`✅ 주문자(${userId})에게 배달 완료 이벤트 전송`);
    });

  });

  // Test Socket 함수임.
  const emitSocketTest = (message) => {
    io.emit("socketTest", message);
  };
  
  const emitMatchTest = (message) => {
    io.emit("matchTest", message);
  }
  
  const showOrderData = (orderData) => {
    io.emit('showOrderData', orderData);
  }

// 주문 상태 전송 (주문자에게만 emit)
const emitCancel = (orderData) => {
  const { userId, orderId, status, message } = orderData;

  if (userId) {
    const userIdString = userId.toString();
    const socketId = userSocketMap.get(userIdString);
    if (socketId) {
      io.to(socketId).emit("emitCancel", {
        createdAt: new Date().toISOString(),
        orderId: orderId,
        status: "cancelled",
        message: message || "주문 예약 시간이 지나서 취소",
      });
      console.log(`Emit 성공 -> ${userId}에게 주문 취소 알림 전송:`, orderData);
    } else {
      console.warn(`Emit 실패: ${userId}에 해당하는 소켓 없음`);
    }
  } else {
    console.warn("⚠️ Emit 실패 - userId가 없음", orderData);
  }
};

// 주문 상태 전송 (주문자에게만 emit)
const tossOrderStatus = (orderData) => {
  const userId = orderData.userId;
  if (userId) {
    const userIdString = userId.toString(); // ObjectId → 문자열 변환
    const socketId = userSocketMap.get(userIdString);
    if (socketId) {
      io.to(socketId).emit('order_accepted', {
        createdAt: orderData.createdAt,
        orderId: orderData.orderId,
        status: orderData.status,
      });
      console.log(`Emit 성공 -> ${userId}:`, orderData);
    } else {
      console.warn(`Emit 실패: ${userId}에 해당하는 소켓 없음`);
    }
  } else {
    console.warn("Emit 실패: userId 없음");
  }
};

  return { emitSocketTest,emitMatchTest,showOrderData,tossOrderStatus, emitCancel};
};
