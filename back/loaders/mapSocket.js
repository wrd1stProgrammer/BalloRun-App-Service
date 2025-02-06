const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

module.exports = (locationIo) => {
  if (!locationIo) {
    console.error("Location Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }

  locationIo.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("토큰이 없습니다."));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;
      next();
    } catch (err) {
      return next(new Error("토큰 검증 실패: " + err.message));
    }
  });

  let deliveryLocations = {}; // 배달원의 위치 저장 객체

  locationIo.on("connection", (socket) => {
    console.log(`[LocationSocket] User ${socket.user.userId} connected`);

    // 배달원이 주문을 수락했을 때 트래킹 시작
    socket.on("start_tracking", ({ orderId }) => {
      const deliveryPersonId = socket.user.userId; // JWT에서 가져온 사용자 ID
      console.log(`[LocationSocket] Tracking started for Order ${orderId} by Delivery Person ${deliveryPersonId}`);

      deliveryLocations[orderId] = { deliveryPersonId, latitude: null, longitude: null };
    });

    // 배달원의 위치 업데이트
    socket.on("update_location", ({ orderId, latitude, longitude }) => {
      if (deliveryLocations[orderId]) {
        deliveryLocations[orderId] = { ...deliveryLocations[orderId], latitude, longitude };
        socket.to(orderId).emit("update_location", { orderId, latitude, longitude });
      }
    });

    // 주문자가 배달원의 현재 위치 요청
    socket.on("request_location", ({ orderId }) => {
      if (deliveryLocations[orderId]) {
        socket.emit("update_location", deliveryLocations[orderId]);
      }
    });

    // 배달원이 연결 종료될 때 로그 출력
    socket.on("disconnect", () => {
      console.log(`[LocationSocket] User ${socket.user.userId} disconnected`);
    });
  });
};