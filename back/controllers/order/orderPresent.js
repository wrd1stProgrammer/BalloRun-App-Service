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
    // 1. Redis 캐시에서 데이터 확인
    const cachedData = await redisCli.get(cacheKey);
    if (cachedData) {
      console.log("Redis에서 완료된 주문 데이터를 가져옴");
      return res.json(JSON.parse(cachedData));
    }

    // 2. Redis에 데이터가 없으면 MongoDB에서 조회
    const completedOrders = await Order.find({
      userId,
      status: { $in: ["delivered", "cancelled"] },
    }).lean();

    // if (!completedOrders || completedOrders.length === 0) {
    //   return res.status(404).json({ message: "완료된 주문 내역이 없습니다." });
    // }

    // 3. Redis에 저장 (TTL: 몇초로 할까? 일단 300sec)
    await redisCli.set(cacheKey, JSON.stringify(completedOrders), { EX: 300 });
    console.log("Redis에 완료된 주문 데이터를 캐싱");

    res.json(completedOrders);
  } catch (error) {
    console.error("완료된 주문 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const getOngoingOrders = async (req, res) => {
  const userId = req.user.userId;
  //const redisClient = req.app.get("redisClient");
  //const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
  //const cacheKey = `ongoingOrders:${userId}`;
  const emitMatchTest = req.app.get("emitMatchTest");

  try {
    
    const ongoingOrders = await Order.find({
      userId,
      status: { $in: ["pending", "matched", "inProgress","accepted"] },
    }).lean();


    // !! 주문 요청 성공 Socket Test Code
    emitMatchTest(`주문 요청 성공!?`);

    res.json(ongoingOrders);
  } catch (error) {
    console.error("진행 중인 주문 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const getDeliveryList = async (req, res) => {
  const userId = req.user.userId;
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4; // Redis v4 클라이언트 사용
  const cacheKey = `completedOrders:delivery:${userId}`;

  try {
    // 1. Redis 캐시에서 데이터 확인
    const cachedData = await redisCli.get(cacheKey);
    if (cachedData) {
      console.log("Redis에서 완료된 주문 데이터를 가져옴");
      return res.json(JSON.parse(cachedData));
    }

    // 2. Redis에 데이터가 없으면 MongoDB에서 조회
    const completedOrders = await Order.find({
      riderId: userId,
    }).lean();


    await redisCli.set(cacheKey, JSON.stringify(completedOrders), { EX: 300 });
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


