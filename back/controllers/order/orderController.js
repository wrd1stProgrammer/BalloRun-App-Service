const Order = require("../../models/Order");
const User = require("../../models/User");

const orderNowDirect = async(req, res) => {
  const { items, lat, lng, isMatch, deliveryType, pickupTime } = req.body;

  const accessToken = req.headers.authorization?.split(" ")[1];

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;
  console.log(userId);
  
    try {
      // 배달 타입이 'direct'인지 확인
      if (deliveryType === 'direct') {
        const order = new Order({
          userId: userId, // authMiddleware로 사용자 확인
          items,
          lat,
          lng,
          isMatch,
          deliveryType,
          pickupTime,
        });
  
        const savedOrder = await order.save();
  
        // 클라이언트에 실시간 알림 전송
        // req.io.emit('orderCreated', savedOrder);
  
        return res.status(201).json(savedOrder);
      } else if (deliveryType === 'cupHolder') {
        // cupHolder 배달 처리 로직
        return res
          .status(400)
          .json({ message: '현재 cupHolder 배달 타입은 지원하지 않습니다.' });
      } else {
        return res.status(400).json({ message: '잘못된 배달 타입입니다.' });
      }
    } catch (error) {
      console.error('주문 생성 실패:', error);
      return res.status(500).json({ message: '주문 생성에 실패했습니다.' });
    }
  };

  module.exports ={
    orderNowDirect
  };