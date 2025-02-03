const activeDeliveries = {}; // { orderId: { riderId, customerUserId } }
const userSockets = {}; // { userId: socketId }

module.exports = (locationIo) => {
    locationIo.on("connection", (socket) => {
        console.log(`✅ 사용자 연결됨: ${socket.id}`);

        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
        });

        socket.on("acceptDelivery", ({ orderId, deliveryUserId, customerUserId }) => {
            activeDeliveries[orderId] = { deliveryUserId, customerUserId };
            const customerSocketId = userSockets[customerUserId];

            if (customerSocketId) {
                locationIo.to(customerSocketId).emit("deliveryAccepted", { deliveryUserId });
            }
        });

        socket.on("updateLocation", ({ userId, latitude, longitude }) => {
            console.log(`📍 배달원 위치 업데이트: ${latitude}, ${longitude}`);

            for (const orderId in activeDeliveries) {
                if (activeDeliveries[orderId].deliveryUserId === userId) {
                    const customerUserId = activeDeliveries[orderId].customerUserId;
                    const customerSocketId = userSockets[customerUserId];

                    if (customerSocketId) {
                        locationIo.to(customerSocketId).emit("receiveLocation", { latitude, longitude });
                    }
                }
            }
        });

        // 주문자가 위치 요청 시 해당 배달원의 최신 위치를 즉시 전송
        socket.on("requestLocation", ({ orderId }) => {
            if (activeDeliveries[orderId]) {
                const { deliveryUserId, customerUserId } = activeDeliveries[orderId];
                const riderSocketId = userSockets[deliveryUserId];

                if (riderSocketId) {
                    locationIo.to(riderSocketId).emit("sendLatestLocation", { orderId });
                }
            }
        });

        socket.on("disconnect", () => {
            console.log(`❌ 사용자 연결 종료: ${socket.id}`);
            for (let userId in userSockets) {
                if (userSockets[userId] === socket.id) {
                    delete userSockets[userId];
                    break;
                }
            }
        });
    });
};
