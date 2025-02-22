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

  // let deliveryLocations = {}; // 배달원의 위치 저장 객체

  // locationIo.on("connection", (socket) => {
  //   console.log(`지도소켓 User ${socket.user.userId} connected`);

  //   // 배달원이 주문을 수락했을 때 트래킹 시작
  //   socket.on("start_tracking", ({ orderId }) => {
  //     const deliveryPersonId = socket.user.userId; // JWT에서 가져온 사용자 ID
  //     console.log(`지도 소켓 Tracking started for Order ${orderId} by Delivery Person ${deliveryPersonId}`);
  //     console.log(orderId)
  //     deliveryLocations[orderId] = { orderId, latitude: null, longitude: null };
  //   });

    // socket.on("join_order", ({ orderId }) => {
    //   socket.join(orderId);
    //   console.log(`배달원이 주문 ${orderId} 방에 참가함`);
    // });

  //   // 배달원의 위치 업데이트
  //   socket.on("update_location", ({ orderId, latitude, longitude }) => {
  //     console.log("프론트에서 백으로 위치를 보냄")
  //     if (deliveryLocations[orderId]) {
  //       console.log("백에서 사용자의 GPS 위치를 저장함")

  //       deliveryLocations[orderId] = { ...deliveryLocations[orderId], latitude, longitude };
  //       socket.to(orderId).emit("update_location", { orderId, latitude, longitude });
  //       socket.emit("update_location", { orderId, latitude, longitude });
  //       console.log("특정 사용자에게 데이터를 보냄")
  //     }
  //   });

  //   // 주문자가 배달원의 현재 위치 요청
  //   socket.on("request_location", ({ orderId }) => {
  //     console.log("주문자가 request_location했음")
  //     console.log(orderId)
  //     if (deliveryLocations[orderId]) {
  //       socket.emit("update_location", deliveryLocations[orderId]);
  //       console.log("백엔드에서 프론트로 위치를 보냄")
  //     }
  //   });

  //   // 배달원이 연결 종료될 때 로그 출력
  //   socket.on("disconnect", () => {
  //     console.log(`[LocationSocket] User ${socket.user.userId} disconnected`);
  //   });
  // });

  let deliveryLocations = {}; // 배달원의 위치 저장 객체

locationIo.on("connection", (socket) => {
  console.log(`지도소켓 User ${socket.user.userId} connected`);

    socket.on("join_order", ({ orderId }) => {
    socket.join(orderId);
    console.log(`배달원이 주문 ${orderId} 방에 참가함`);
  });

  // 배달원이 주문을 수락했을 때 트래킹 시작
  socket.on("start_tracking", ({ orderId }) => {
    const deliveryPersonId = socket.user.userId; // JWT에서 가져온 사용자 ID
    console.log(`Tracking started for Order ${orderId} by Delivery Person ${deliveryPersonId}`);
    
    deliveryLocations[orderId] = {
      orderId,
      deliveryPersonId,  // 🚀 배달원의 ID 저장
      latitude: null,
      longitude: null,
    };
  });

  // 배달원의 위치 업데이트
  socket.on("update_location", ({ orderId, latitude, longitude }) => {
    console.log("프론트에서 백으로 위치를 보냄");

    if (deliveryLocations[orderId]) {
      console.log("백에서 배달원의 GPS 위치를 저장함");

      deliveryLocations[orderId] = { 
        ...deliveryLocations[orderId], 
        latitude, 
        longitude 
      };

      // 🚀 해당 주문의 배달원 ID 포함해서 전송
      socket.to(orderId).emit("update_location", { 
        orderId, 
        deliveryPersonId: socket.user.userId, 
        latitude, 
        longitude 
      });
    }
  });

  // 주문자가 배달원의 현재 위치 요청
  socket.on("request_location", ({ orderId }) => {
    console.log("주문자가 request_location 요청함", orderId);

    if (deliveryLocations[orderId]) {
      socket.emit("update_location", deliveryLocations[orderId]);
      console.log("백엔드에서 주문자에게 위치 데이터를 보냄");
    }
  });

  socket.on("disconnect", () => {
    console.log(`[LocationSocket] User ${socket.user.userId} disconnected`);
  });
});
};