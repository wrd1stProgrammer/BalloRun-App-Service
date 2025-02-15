const Order = require("../../models/Order");
const User = require("../../models/User");


/*
<주문 내역 조회>
1. getCompletedOrders -> getOngoingOrders 순서로 비동기 조회
2. 완료 데이터 부터 조회 -> 진행 데이터 조회

!!!!!!!!TEST 필요 !!!!!!!!!
*/

const getCompletedOrders = async (req, res) => {
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
  
    // 3. DB 조회
    const completedOrders = await Order.find({
      userId,
      status: { $in: ["delivered"] }
    }).lean();

    // 4. 캐시 저장 (데이터 있을 때만)
    if (completedOrders.length > 0) {
      await redisCli.set(cacheKey, JSON.stringify(completedOrders), {
        EX: 30000,
        NX: true // 기존 키가 없을 때만 저장
      });
    }
  
    res.json(completedOrders);
  } catch (error) {
    console.error("완료된 주문 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};


// 진행 + 주문 조회 
const getOngoingOrders = async (req, res) => {
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
  
    // 3. DB 조회
    const ongoingOrders = await Order.find({
      userId,
      status: { $in: ["pending", "matched", "inProgress", "accepted", "cancelled","goToCafe","makingMenu","goToClient","complete"] }
    }).lean();
  // goToCafe : 카페가는중, makingMenu:제조중 , goToClient: 고객에게 가는중

    // 4. 캐시 저장 (데이터 있을 때만)
    if (ongoingOrders.length > 0) {
      await redisCli.set(cacheKey, JSON.stringify(ongoingOrders), {
        EX: 3000,
        NX: true // 기존 키가 없을 때만 저장
      });
    }
  
    res.json(ongoingOrders);
  } catch (error) {
    console.error("[오류]", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

const getDeliveryList = async (req, res) => {
  const userId = req.user.userId;
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
  const cacheKey = `completedOrders:delivery:${userId}`;

  try {
    // 1. Redis 캐시에서 데이터 확인
    
    /*
    const cachedData = await redisCli.get(cacheKey);
    
    if (cachedData) {
      console.log("Redis에서 완료된 주문 데이터를 가져옴");
      return res.json(JSON.parse(cachedData));
    }
    */

    // 2. Redis에 데이터가 없으면 MongoDB에서 조회
    const completedOrders = await Order.find({
      riderId: userId,
    }).lean();


    // await redisCli.set(cacheKey, JSON.stringify(completedOrders), { EX: 300 });
    console.log("Redis에 완료된 주문 데이터를 캐싱");

    res.json(completedOrders);
  } catch (error) {
    console.error("완료된 주문 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};


module.exports = {
  getCompletedOrders,
  getOngoingOrders,
  getDeliveryList
};


