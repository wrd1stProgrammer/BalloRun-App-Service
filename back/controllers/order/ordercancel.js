const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");
const OrderCancellation = require("../../models/OrderCancellation");
const { invalidateOnGoingOrdersCache,invalidateCompletedOrdersCache } = require("../../utils/deleteRedisCache");

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
      //redis 객체 가져오깅
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
  
      // 6. 매칭 여부 확인 및 처리
      const isMatched = !!order.riderId;
      if (isMatched) {
        // 매칭되면 라이더에게 알람. 
        // isDelivering 상태 업뎃.
        console.log('라이더 있는 부분 주문취소');
        const riderUser = await User.findById(order.riderId);
        console.log(riderUser,'Rideruser 찾음??');
        riderUser.isDelivering = false;
        await riderUser.save(); // 라이더는 refetch 강제 해야 + 알림 ?

        console.log(`라이더 ${order.riderId}에게 알림 전송 준비: 주문 ${orderId} 취소`);
      }else{
        //진행 중인 주문 레디스 삭제.
        const cacheKey = "activeOrders";
        let redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
        redisOrders = redisOrders.filter((order) => order._id.toString() !== orderId);
        await redisCli.set(cacheKey, JSON.stringify(redisOrders));
    
      }
      
      await invalidateOnGoingOrdersCache(order.userId, redisCli);
      await invalidateCompletedOrdersCache(order.userId,redisCli);
  
      // 7. 성공 응답
      return res.status(200).json({
        message: "주문 취소 요청이 성공적으로 처리되었습니다.",
        cancellationId: cancellation._id.toString(),
      });
    } catch (error) {
      console.error("Error in orderCancelApi:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
module.exports = { getOrderDataForCancelApi,orderCancelApi };