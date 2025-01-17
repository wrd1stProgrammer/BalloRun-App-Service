const Order = require("../../models/Order");
const User = require("../../models/User");

const orderLaterDirectCreate = async (req, res) => {
    //요청사항 추가
    const { items, lat, lng, isMatch, deliveryFee, deliveryType, pickupTime,startTime, } = req.body;
  
    const userId = req.user.userId; // authMiddleWare 에서 가져옴.

    try {
      // 배달 타입이 'direct'인지 확인
      if (deliveryType === "direct") {
        const order = new Order({
          userId: userId, // authMiddleware로 사용자 확인
          items,
          lat,
          lng,
          isMatch,
          deliveryFee,
          deliveryType,
          pickupTime,// 픽업시간? == endTime ?
          startTime, // 요청시간? 
          // 배달원 요청사항
        });
  
        const savedOrder = await order.save();
  
  
        return res.status(201).json(savedOrder);
      } else if (deliveryType === "cupHolder") {
        const order = new Order({
          userId: userId, // authMiddleware로 사용자 확인
          items,
          lat,
          lng,
          isMatch,
          deliveryFee,
          deliveryType,
          pickupTime,
          // 배달원 요청사항
          // 층수
        });
  
        const savedOrder = await order.save();
  
        return res.status(201).json(savedOrder);
  
      } else {
        return res.status(400).json({ message: "잘못된 배달 타입입니다." });
      }
    } catch (error) {
      console.error("주문 생성 실패:", error);
      return res.status(500).json({ message: "주문 생성에 실패했습니다." });
    }
  };


  module.exports = {
    orderLaterDirectCreate,
  };
  