const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const OrderCancellation = require("../../models/OrderCancellation");
const { invalidateOnGoingOrdersCache,invalidateCompletedOrdersCache } = require("../../utils/deleteRedisCache");
const { sendPushNotification } = require("../../utils/sendPushNotification");
const fetch = require("node-fetch");


const getOrderDataForCancelApi = async (req, res) => {
    try {
      const { orderId, orderType } = req.body;
  
      let order;
      const currentTime = new Date();
  
      // orderType에 따라 모델 조회
      if (orderType === "Order") {
        order = await Order.findById(orderId);
      } else if (orderType === "NewOrder") {
        order = await NewOrder.findById(orderId);
      } else {
        return res.status(400).json({ error: "Invalid orderType" });
      }
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // 타입에 따른 주문 금액 결정
      let orderPrice;
      if (orderType === "Order") {
        orderPrice = order.price;
      } else {
        // NewOrder: priceOffer 사용
        orderPrice = order.priceOffer;
      }
  
      // 캐리어 매칭 여부 확인 (riderId 존재 여부로 판단)
      const isMatched = !!order.riderId;
      const matchTime = order.updatedAt || order.createdAt; // riderId가 설정된 시점
      const timeElapsed = (currentTime - new Date(matchTime)) / (1000 * 60); // 분 단위 경과 시간
  
      let penaltyAmount = 0;
      let refundAmount = orderPrice + order.deliveryFee;
  
      // 즉시 배달 서비스 (isReservation: false)
      if (!order.isReservation) {
        if (!isMatched) {
          penaltyAmount = 0;
          refundAmount = orderPrice + order.deliveryFee; // 매칭 전 취소
        } else if (timeElapsed <= 5) {
          penaltyAmount = 0;
          refundAmount = orderPrice + order.deliveryFee; // 5분 이내
        } else if (timeElapsed <= 10) {
          penaltyAmount = 200;
          refundAmount = orderPrice + order.deliveryFee; // 5~10분
        } else if (timeElapsed <= 20) {
          penaltyAmount = 3000;
          refundAmount = orderPrice + order.deliveryFee; // 10~20분
        } else {
          penaltyAmount = 5000;
          refundAmount = orderPrice + order.deliveryFee; // 20분 초과
        }
      }
  
      // 시간 예약 서비스 (isReservation: true)
      if (order.isReservation) {
        if (!isMatched) {
          penaltyAmount = 0;
          refundAmount = orderPrice + order.deliveryFee; // 매칭 전 취소
        } else {
          const startTime = new Date(order.startTime);
          const timeToStart = (startTime - currentTime) / (1000 * 60); // 서비스 시작까지 남은 시간 (분)
          if (timeToStart <= 60) {
            penaltyAmount = 3000;
            refundAmount = orderPrice + order.deliveryFee; // 1시간 이내
          } else {
            penaltyAmount = 0;
            refundAmount = orderPrice + order.deliveryFee; // 1시간 초과
          }
        }
      }
  
      // 반환할 데이터 구성
      const orderData = {
        orderId: order._id.toString(),
        orderType,
        price: orderPrice,
        deliveryFee: order.deliveryFee,
        penaltyAmount,
        refundAmount,
        totalAmount: orderPrice + order.deliveryFee, // 계산된 총액
        createdAt: order.createdAt,
        isReservation: order.isReservation,
        isMatched,
      };
  
      return res.status(200).json(orderData);
    } catch (error) {
      console.error("Error calculating penalty:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  const getPortOneAccessToken = async () => {
    const response = await fetch("https://api.portone.io/login/api-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiSecret: process.env.PORTONE_API_SECRET,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to retrieve PortOne access token");
    }
  
    const data = await response.json();
    return data.access_token;
  };
  
  const cancelPayment = async (paymentId, reason) => {
    const accessToken = await getPortOneAccessToken();
    console.log(accessToken,'포트원 토큰')
  
    const response = await axios(`https://api.portone.io/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Payment cancellation failed: ${JSON.stringify(errorData)}`);
    }
  
    const result = await response.json();
    return result;
  };
  
  const orderCancelApi = async (req, res) => {
    try {
      const { orderId, orderType, cancelReason, refundAmount, penaltyAmount } = req.body;
  
      if (!orderId || !orderType || !cancelReason || refundAmount === undefined || penaltyAmount === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      let order;
      if (orderType === "Order") {
        order = await Order.findById(orderId);
      } else if (orderType === "NewOrder") {
        order = await NewOrder.findById(orderId);
      } else {
        return res.status(400).json({ error: "Invalid orderType" });
      }
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      const redisClient = req.app.get("redisClient");
      const redisCli = redisClient.v4;
  
      order.status = "cancelled";
      await order.save();
  
      const paymentAmount = (orderType === "Order" ? order.price : order.priceOffer) + order.deliveryFee;
  
      const cancellation = new OrderCancellation({
        orderId: order._id,
        orderType,
        cancelReason,
        paymentAmount,
        refundAmount,
        penaltyAmount,
        cancelStatus: "pending",
        riderNotified: false,
      });
  
      await cancellation.save();
  
      order.cancellation = cancellation._id;
      await order.save();
  
      const usedPoints = order.usedPoints || 0;
      if (usedPoints > 0) {
        const user = await User.findById(order.userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        user.point = (user.point || 0) + usedPoints;
        await user.save();
        console.log(`사용자 ${user._id}에게 ${usedPoints} 포인트 환불 완료`);
      }
  
      const isMatched = !!order.riderId;
      if (isMatched) {
        const riderUser = await User.findById(order.riderId);
        riderUser.isDelivering = false;
        await riderUser.save();
  
        if (riderUser.fcmToken && riderUser.allOrderAlarm) {
          const notificationPayload = {
            title: "주문이 취소되었습니다.",
            body: `고객이 주문을 취소하였습니다.`,
            data: { type: "order_cancel", Id: orderId },
          };
          await sendPushNotification(riderUser.fcmToken, notificationPayload);
          console.log(`라이더 ${order.riderId}에게 알림 전송 성공`);
          await cancellation.save();
        } else {
          console.log(`라이더 ${order.riderId}의 FCM 토큰이 없습니다. 또는 알람 끔${riderUser.allOrderAlarm}`);
        }
      } else {
        const cacheKey = "activeOrders";
        let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
        redisOrders = redisOrders.filter((order) => order._id.toString() !== orderId);
        await redisCli.set(cacheKey, JSON.stringify(redisOrders));
      }
  
      await invalidateOnGoingOrdersCache(order.userId, redisCli);
      await invalidateCompletedOrdersCache(order.userId, redisCli);
  
      // 결제 취소 로직
      try {
        const paymentId = order.paymentId;
        if (paymentId) {
          await cancelPayment(paymentId, cancelReason);
          console.log(`결제 ${paymentId} 취소 완료`);
        } else {
          console.warn("paymentId가 존재하지 않아 결제 취소를 수행하지 못했습니다.");
        }
      } catch (err) {
        console.error("결제 취소 실패:", err);
      }
  
      return res.status(200).json({
        message: "주문 취소 요청이 성공적으로 처리되었습니다.",
        cancellationId: cancellation._id.toString(),
      });
    } catch (error) {
      console.error("Error in orderCancelApi:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  //주문자가 취소
  /*
  const orderCancelApi = async (req, res) => {
    try {
      // 1. 요청 데이터 추출
      const { orderId, orderType, cancelReason, refundAmount, penaltyAmount } = req.body;
  
      // 입력값 검증
      if (!orderId || !orderType || !cancelReason || refundAmount === undefined || penaltyAmount === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // 2. orderType에 따라 주문 조회
      let order;
      if (orderType === "Order") {
        order = await Order.findById(orderId);
      } else if (orderType === "NewOrder") {
        order = await NewOrder.findById(orderId);
      } else {
        return res.status(400).json({ error: "Invalid orderType" });
      }
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // redis 객체 가져오기
      const redisClient = req.app.get("redisClient");
      const redisCli = redisClient.v4;
  
      order.status = "cancelled";
      await order.save();
  
      // 3. 결제 금액 계산 (price와 deliveryFee 합산)
      const paymentAmount = (orderType === "Order" ? order.price : order.priceOffer) + order.deliveryFee;
  
      // 4. OrderCancellation 생성
      const cancellation = new OrderCancellation({
        orderId: order._id,
        orderType,
        cancelReason,
        paymentAmount,
        refundAmount,
        penaltyAmount,
        cancelStatus: "pending", // 초기 상태
        riderNotified: false, // 초기값
      });
  
      await cancellation.save();
  
      // 5. 주문 모델에 cancellation 연결
      order.cancellation = cancellation._id;
      await order.save();
  
      // 6. 사용된 포인트 환불 처리
      const usedPoints = order.usedPoints || 0; // 주문에서 사용된 포인트 가져오기 (없으면 0으로 처리)
      if (usedPoints > 0) {
        const user = await User.findById(order.userId); // 주문한 사용자 조회
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        user.point = (user.point || 0) + usedPoints; // 사용자 포인트에 사용된 포인트 추가
        await user.save();
        console.log(`사용자 ${user._id}에게 ${usedPoints} 포인트 환불 완료`);
      }
  
      // 7. 매칭 여부 확인 및 처리
      const isMatched = !!order.riderId;
      if (isMatched) {
        // 매칭되면 라이더에게 알람 및 isDelivering 상태 업데이트
        console.log('라이더 있는 부분 주문취소');
        const riderUser = await User.findById(order.riderId);
        console.log(riderUser, 'Rideruser 찾음??');
        riderUser.isDelivering = false;
        await riderUser.save(); // 라이더는 refetch 강제 + 알림
  
        // 8. 라이더에게 푸시 알림 전송,
        if (riderUser.fcmToken && riderUser.allOrderAlarm) {
          const notificationPayload = {
            title: "주문이 취소되었습니다.",
            body: `고객이 주문을 취소하였습니다.`,
            data: { type: "order_cancel", Id: orderId },
          };
          await sendPushNotification(riderUser.fcmToken, notificationPayload);
          console.log(`라이더 ${order.riderId}에게 알림 전송 성공`);
          // cancellation.riderNotified = true; // 알림 전송 성공 시 상태 업데이트
          await cancellation.save();
        } else {
          console.log(`라이더 ${order.riderId}의 FCM 토큰이 없습니다. 또는 알람 끔${riderUser.allOrderAlarm}`);
        }
        console.log(`라이더 ${order.riderId}에게 알림 전송 준비: 주문 ${orderId} 취소`);
      } else {
        // 진행 중인 주문 레디스 삭제
        const cacheKey = "activeOrders";
        let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
        redisOrders = redisOrders.filter((order) => order._id.toString() !== orderId);
        await redisCli.set(cacheKey, JSON.stringify(redisOrders));
      }
  
      await invalidateOnGoingOrdersCache(order.userId, redisCli);
      await invalidateCompletedOrdersCache(order.userId, redisCli);
  
      // 9. 성공 응답
      return res.status(200).json({
        message: "주문 취소 요청이 성공적으로 처리되었습니다.",
        cancellationId: cancellation._id.toString(),
      });
    } catch (error) {
      console.error("Error in orderCancelApi:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  */
module.exports = { getOrderDataForCancelApi,orderCancelApi };