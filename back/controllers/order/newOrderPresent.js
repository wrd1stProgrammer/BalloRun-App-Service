const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const User = require("../../models/User");

const mongoose = require('mongoose');

const getCompletedNewOrders = async (req, res) => {
    const userId = req.user.userId;
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
    const cacheKey = `completedOrders:${userId}`;
  
    try {
      // 1. 캐시 조회
      const cachedData = await redisCli.get(cacheKey);
    
      // 2. 캐시 검증
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.length === 0) {
          console.log("[캐시 무효] 빈 배열 발견");
        } else {
          console.log("[캐시 히트] 진행중 주문");
          return res.json(parsedData);
        }
      }
    
   // 3. 캐시 미스 시 DB 조회
   const orders = await Order.find({ userId, status: { $in: ['delivered', 'cancelled', 'complete'] } }).lean();
   const newOrders = await NewOrder.find({ userId, status: { $in: ['delivered', 'cancelled', 'complete'] } }).lean();

   // 4. Order와 NewOrder를 동일한 인터페이스로 변환
   const transformedOrders = orders.map(order => ({
     _id: order._id,
     name: order.items[0].cafeName, // 첫 번째 아이템의 cafeName 사용
     status: order.status,
     createdAt: order.createdAt,
     orderDetails: order.riderRequest,
     priceOffer: order.items[0].price, // 첫 번째 아이템의 price 사용
     deliveryFee: order.deliveryFee,
   }));

   const transformedNewOrders = newOrders.map(newOrder => ({
     _id: newOrder._id,
     name: newOrder.name,
     status: newOrder.status,
     createdAt: newOrder.createdAt,
     orderDetails: newOrder.orderDetails,
     priceOffer: newOrder.priceOffer,
     deliveryFee: newOrder.deliveryFee,
   }));

   const combinedOrders = [...transformedOrders, ...transformedNewOrders];

  
      // 4. 캐시 저장 (데이터 있을 때만)
      if (combinedOrders.length > 0) {
        await redisCli.set(cacheKey, JSON.stringify(combinedOrders), {
          EX: 30000,
          NX: true // 기존 키가 없을 때만 저장
        });
      }
    
      res.json(combinedOrders);
    } catch (error) {
      console.error("완료된 주문 조회 중 오류 발생:", error);
      res.status(500).json({ message: "서버 오류" });
    }
  };

const getOnGoingNewOrders = async (req, res) => {
  const redisCli = req.app.get("redisClient").v4;
  const userId = req.user.userId;
  const cacheKey = `OnGoingOrders:${userId}`;

  try {
    // 1. 캐시 조회
    const cachedData = await redisCli.get(cacheKey);

    // 2. 캐시 검증
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (Array.isArray(parsedData) && parsedData.length === 0) {
        console.log("[캐시 무효] 빈 배열 발견");
      } else {
        console.log("[캐시 히트] 진행중 주문");
        return res.json(parsedData);
      }
    }

    // 3. 캐시 미스 시 DB 조회
    const orders = await Order.find({ userId, status: { $nin: ['delivered', 'cancelled', 'complete'] } }).lean();
    const newOrders = await NewOrder.find({ userId, status: { $nin: ['delivered', 'cancelled', 'complete'] } }).lean();

    // 4. Order와 NewOrder를 동일한 인터페이스로 변환
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      name: order.items[0].cafeName, // 첫 번째 아이템의 cafeName 사용
      status: order.status,
      createdAt: order.createdAt,
      orderDetails: order.riderRequest,
      priceOffer: order.items[0].price, // 첫 번째 아이템의 price 사용
      deliveryFee: order.deliveryFee,
      orderType:order.orderType,
    }));

    const transformedNewOrders = newOrders.map(newOrder => ({
      _id: newOrder._id,
      name: newOrder.name,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
      orderDetails: newOrder.orderDetails,
      priceOffer: newOrder.priceOffer,
      deliveryFee: newOrder.deliveryFee,
      orderType:newOrder.orderType,
    }));

    const combinedOrders = [...transformedOrders, ...transformedNewOrders];

    // 5. 조회된 데이터 캐시에 저장
    await redisCli.set(cacheKey, JSON.stringify(combinedOrders), 'EX', 60 * 1); // 1시간 유효

    // 6. 클라이언트에 반환
    return res.json(combinedOrders);
  } catch (error) {
    console.error("주문 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "주문 조회 중 오류가 발생했습니다." });
  }
};

const fetchOrderDetails = async (req, res) => {
    const { orderId, orderType } = req.body; // 바디에서 orderId와 orderType 추출
  
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }
  
    try {
      const order = await NewOrder.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // 조회된 NewOrder 데이터 반환
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = { getOnGoingNewOrders , getCompletedNewOrders ,fetchOrderDetails};