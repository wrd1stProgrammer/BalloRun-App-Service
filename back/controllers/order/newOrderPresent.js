const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder");
const ChatRoom = require("../../models/ChatRoom");
const User = require("../../models/User");

const mongoose = require("mongoose");
const {
  invalidateCompletedOrdersCache,
} = require("../../utils/deleteRedisCache");

const getBannerData = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" })
      .sort({ createdAt: -1 }) // 최신순 정렬
      .limit(5); // 최대 5개만 가져오기

    const newOrders = await NewOrder.find({ status: "pending" })
      .sort({ createdAt: -1 }) // 최신순 정렬
      .limit(5); // 최대 5개만 가져오기

    // Order 모델 데이터 변환
    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      orderId: order._id,
      name: order.items[0]?.cafeName || "카페 이름 없음", // items.cafeName
      orderDetails: order.items[0]?.menuName,
      deliveryFee: order.deliveryFee,
      lat: order.lat,
      lng: order.lng,
    }));

    // NewOrder 모델 데이터 변환 (필드가 동일하므로 그대로 사용)
    const formattedNewOrders = newOrders.map((order) => ({
      _id: order._id.toString(),
      orderId: order._id,
      name: order.name,
      orderDetails: order.orderDetails,
      deliveryFee: order.deliveryFee,
      lat: order.lat,
      lng: order.lng,
    }));

    // 두 모델의 데이터를 합치기
    const bannerData = [...formattedOrders, ...formattedNewOrders].slice(0, 5); // 최대 5개만 반환

    // 클라이언트에 응답
    res.status(200).json({
      success: true,
      data: bannerData,
    });
  } catch (error) {
    console.error("배너 데이터 불러오기 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 배너 데이터를 불러오지 못했습니다.",
    });
  }
};

const getOnGoingNewOrders = async (req, res) => {
  const redisCli = req.app.get("redisClient").v4;
  const userId = req.user.userId;
  const cacheKey = `OnGoingOrders:${userId}`;

  try {
    const cachedData = await redisCli.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (Array.isArray(parsedData) && parsedData.length === 0) {
        console.log("[캐시 무효] 빈 배열 발견");
      } else {
        console.log("[캐시 히트] 진행중 주문");
        return res.json(parsedData);
      }
    }

    const orders = await Order.find({
      userId,
      status: { $nin: ["delivered", "cancelled", "complete"] },
    }).lean();
    const newOrders = await NewOrder.find({
      userId,
      status: { $nin: ["delivered", "cancelled", "complete"] },
    }).lean();
    const user = await User.findById(userId).lean(); // 유저 정보 조회

    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        const chatRoom = await ChatRoom.findOne({
          users: { $all: [order.userId, order.riderId || null] },
        });

        let riderInfo = {
          username: "알 수 없음",
          nickname: "알 수 없음",
          userImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwji6ZSccePZz-0s7YFXy0XmOXr1B-mn1IQ&s",
        };
        if (order.riderId) {
          const rider = await User.findById(order.riderId).lean();
          if (rider) {
            riderInfo = {
              username: rider.username,
              nickname: rider.nickname,
              userImage: rider.userImage,
            };
          }
        }

        return {
          _id: order._id,
          name: order.items[0].cafeName,
          status: order.status,
          createdAt: order.createdAt,
          orderDetails: order.riderRequest,
          priceOffer: order.items[0].price, // Order 모델은 usedPoints 없으므로 그대로
          deliveryFee: order.deliveryFee,
          orderType: order.orderType,
          roomId: chatRoom ? chatRoom._id : null,
          riderUsername: riderInfo.username,
          riderNickname: riderInfo.nickname,
          riderUserImage: riderInfo.userImage,
          isRated: order.isRated,
          userPoints: user?.point || 0, // 유저 포인트 추가
        };
      })
    );

    const transformedNewOrders = await Promise.all(
      newOrders.map(async (newOrder) => {
        const chatRoom = await ChatRoom.findOne({
          users: { $all: [newOrder.userId, newOrder.riderId || null] },
        });

        let riderInfo = {
          username: "알 수 없음",
          nickname: "알 수 없음",
          userImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwji6ZSccePZz-0s7YFXy0XmOXr1B-mn1IQ&s",
        };
        if (newOrder.riderId) {
          const rider = await User.findById(newOrder.riderId).lean();
          if (rider) {
            riderInfo = {
              username: rider.username,
              nickname: rider.nickname,
              userImage: rider.userImage,
            };
          }
        }

        return {
          _id: newOrder._id,
          name: newOrder.name,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
          orderDetails: newOrder.orderDetails,
          priceOffer: newOrder.priceOffer - (newOrder.usedPoints || 0), // usedPoints 뺀 가격
          deliveryFee: newOrder.deliveryFee,
          orderType: newOrder.orderType,
          roomId: chatRoom ? chatRoom._id : null,
          riderUsername: riderInfo.username,
          riderNickname: riderInfo.nickname,
          riderUserImage: riderInfo.userImage,
          isRated: newOrder.isRated,
          userPoints: user?.point || 0, // 유저 포인트 추가
        };
      })
    );

    const combinedOrders = [...transformedOrders, ...transformedNewOrders];

    await redisCli.set(cacheKey, JSON.stringify(combinedOrders), "EX", 60 * 1);

    return res.json(combinedOrders);
  } catch (error) {
    console.error("주문 조회 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "주문 조회 중 오류가 발생했습니다." });
  }
};

const getCompletedNewOrders = async (req, res) => {
  const userId = req.user.userId;
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4;
  const cacheKey = `completedOrders:${userId}`;

  try {
    const cachedData = await redisCli.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (Array.isArray(parsedData) && parsedData.length === 0) {
        console.log("[캐시 무효] 빈 배열 발견");
      } else {
        console.log("[캐시 히트] 완료된 주문");
        return res.json(parsedData);
      }
    }

    const orders = await Order.find({
      userId,
      status: { $in: ["delivered", "cancelled", "complete"] },
    }).lean();
    const newOrders = await NewOrder.find({
      userId,
      status: { $in: ["delivered", "cancelled", "complete"] },
    }).lean();
    const user = await User.findById(userId).lean(); // 유저 정보 조회

    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        const chatRoom = await ChatRoom.findOne({
          users: { $all: [order.userId, order.riderId || null] },
        });

        let riderInfo = {
          username: "알 수 없음",
          nickname: "알 수 없음",
          userImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwji6ZSccePZz-0s7YFXy0XmOXr1B-mn1IQ&s",
        };
        if (order.riderId) {
          const rider = await User.findById(order.riderId).lean();
          if (rider) {
            riderInfo = {
              username: rider.username,
              nickname: rider.nickname,
              userImage: rider.userImage,
            };
          }
        }

        return {
          _id: order._id,
          name: order.items[0].cafeName,
          status: order.status,
          createdAt: order.createdAt,
          orderDetails: order.riderRequest,
          priceOffer: order.items[0].price, // Order 모델은 usedPoints 없으므로 그대로
          deliveryFee: order.deliveryFee,
          roomId: chatRoom ? chatRoom._id : null,
          riderUsername: riderInfo.username,
          riderNickname: riderInfo.nickname,
          riderUserImage: riderInfo.userImage,
          isRated: order.isRated,
          userPoints: user?.point || 0, // 유저 포인트 추가
        };
      })
    );

    const transformedNewOrders = await Promise.all(
      newOrders.map(async (newOrder) => {
        const chatRoom = await ChatRoom.findOne({
          users: { $all: [newOrder.userId, newOrder.riderId || null] },
        });

        let riderInfo = {
          username: "알 수 없음",
          nickname: "알 수 없음",
          userImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwji6ZSccePZz-0s7YFXy0XmOXr1B-mn1IQ&s",
        };
        if (newOrder.riderId) {
          const rider = await User.findById(newOrder.riderId).lean();
          if (rider) {
            riderInfo = {
              username: rider.username,
              nickname: rider.nickname,
              userImage: rider.userImage,
            };
          }
        }

        return {
          _id: newOrder._id,
          name: newOrder.name,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
          orderDetails: newOrder.orderDetails,
          priceOffer: newOrder.priceOffer - (newOrder.usedPoints || 0), // usedPoints 뺀 가격
          deliveryFee: newOrder.deliveryFee,
          roomId: chatRoom ? chatRoom._id : null,
          riderUsername: riderInfo.username,
          riderNickname: riderInfo.nickname,
          riderUserImage: riderInfo.userImage,
          isRated: newOrder.isRated,
          userPoints: user?.point || 0, // 유저 포인트 추가
        };
      })
    );

    const combinedOrders = [...transformedOrders, ...transformedNewOrders];

    if (combinedOrders.length > 0) {
      await redisCli.set(cacheKey, JSON.stringify(combinedOrders), {
        EX: 30000,
        NX: true,
      });
    }

    res.json(combinedOrders);
  } catch (error) {
    console.error("완료된 주문 조회 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const fetchOrderDetails = async (req, res) => {
  const { orderId, orderType } = req.body; // 바디에서 orderId와 orderType 추출

  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  try {
    const order = await NewOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 조회된 NewOrder 데이터 반환
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rateRiderStars = async (req, res) => {
  const { orderId, rating } = req.body;
  const redisClient = req.app.get("redisClient");
  const redisCli = redisClient.v4;

  // 입력값 검증
  if (!orderId || rating === undefined) {
    return res.status(400).json({ message: "orderId와 rating은 필수입니다." });
  }
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ message: "rating은 0에서 5 사이의 숫자여야 합니다." });
  }

  try {
    // NewOrder 조회
    const order = await NewOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
    }

    // 주문 상태 확인
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "배달 완료된 주문만 평가할 수 있습니다." });
    }

    // 이미 평가된 주문인지 확인
    if (order.isRated) {
      return res.status(400).json({ message: "이미 평가된 주문입니다." });
    }

    // 라이더 조회
    const rider = await User.findById(order.riderId);
    if (!rider) {
      return res.status(404).json({ message: "라이더를 찾을 수 없습니다." });
    }

    // 고객 조회
    const customer = await User.findById(order.userId);
    if (!customer) {
      return res.status(404).json({ message: "고객을 찾을 수 없습니다." });
    }

    // 경험치 및 포인트 맵
    const expMap = {
      1: 5,
      2: 7,
      3: 10,
      4: 15,
      5: 20,
    };
    const riderPointMap = {
      1: 0,
      2: 0,
      3: 50,
      4: 100,
      5: 150,
    };

    // 라이더 경험치 및 포인트 추가
    const experienceToAdd = expMap[rating] || 0;
    const riderPointsToAdd = riderPointMap[rating] || 0;
    rider.exp += experienceToAdd;
    rider.point = (rider.point || 0) + riderPointsToAdd;

    // 고객 경험치 및 포인트 추가
    customer.exp = (customer.exp || 0) + 5; // 고객 경험치 5 증가
    customer.point = (customer.point || 0) + 100; // 고객 포인트 100 증가

    // 주문 상태 업데이트
    order.rating = rating;
    order.isRated = true;

    // 트랜잭션으로 세 모델 동시 저장
    await Promise.all([order.save(), rider.save(), customer.save()]);

    // 캐시 무효화
    await invalidateCompletedOrdersCache(order.userId, redisCli);

    res.status(200).json({
      success: true,
      message: "별점이 성공적으로 등록되었습니다.",
    });
  } catch (error) {
    console.error("별점 등록 오류:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 별점을 등록하지 못했습니다." });
  }
};

module.exports = {
  getOnGoingNewOrders,
  getCompletedNewOrders,
  fetchOrderDetails,
  getBannerData,
  rateRiderStars,
};
