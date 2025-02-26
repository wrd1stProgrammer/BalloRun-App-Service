const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");

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
        orderPrice = order.items.price;
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

module.exports = { getOrderDataForCancelApi };