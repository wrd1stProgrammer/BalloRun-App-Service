const Order = require("../../models/Order");
const User = require("../../models/User");
const {sendPushNotification} = require("../../utils/sendPushNotification");
const {invalidateOnGoingOrdersCache} = require("../../utils/deleteRedisCache");

// 라이더가 주문 진행상황에 따라 상태 변화 시킬 때 쓰는 함수
//['pending', 'matched', 'accepted', 'inProgress', 'delivered', 'cancelled','matchFailed'], // 주문 상태
// goToCafe : 카페가는중, makingMenu:제조중 , goToClient: 고객에게 가는중


const goToCafeHandler = async (req, res) =>{
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용

    const { orderId } = req.body; // 아이디 받아오기
    const order = await Order.findById(orderId);
    const orderUser = await Order.findById(order.userId);
    order.status = "goToCafe";
    order.save();
    
    await invalidateOnGoingOrdersCache(order.userId,redisCli);

    // const notipayload ={
    //     title: `라이더가 카페로 이동 중입니다.`,
    //     body: `실시간 위치를 확인해보세요!`,
    //     data: {type:"order_onGoing", orderId:orderId},
    //   }
    //   if (orderUser.fcmToken) {
    //     //orderUser.fcmToken 로 변경해야함 잘 작동하면
    //     //await sendPushNotification(orderUser.fcmToken, notipayload);
    //   } else {
    //     console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
    //   }
}

const makingMenuHandler = async (req, res) =>{
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용

    const { orderId } = req.body; // 아이디 받아오기
    const order = await Order.findById(orderId);
    const orderUser = await Order.findById(order.userId);
    order.status = "makingMenu";
    order.save();
    
    await invalidateOnGoingOrdersCache(order.userId,redisCli);

    // const notipayload ={
    //     title: `음료 제조 중입니다.`,
    //     body: `실시간 위치를 확인해보세요!`,
    //     data: {type:"order_onGoing", orderId:orderId},
    //   }
    //   if (orderUser.fcmToken) {
    //     //orderUser.fcmToken 로 변경해야함 잘 작동하면
    //     //await sendPushNotification(orderUser.fcmToken, notipayload);
    //   } else {
    //     console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
    //   }

}

const goToClientHandler = async (req, res) =>{
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용

    const { orderId } = req.body; // 아이디 받아오기
    const order = await Order.findById(orderId);
    const orderUser = await Order.findById(order.userId);
    order.status = "goToClient";
    order.save();
    
    await invalidateOnGoingOrdersCache(order.userId,redisCli);

    // const notipayload ={
    //     title: `라이더가 고객에게 이동 중입니다.`,
    //     body: `실시간 위치를 확인해보세요!`,
    //     data: {type:"order_onGoing", orderId:orderId},
    //   }
    //   if (orderUser.fcmToken) {
    //     //orderUser.fcmToken 로 변경해야함 잘 작동하면
    //     //await sendPushNotification(orderUser.fcmToken, notipayload);
    //   } else {
    //     console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
    //   }

}
const completeOrderHandler = async (req, res) =>{
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4; // Redis v4 클라이언트 사용

    const { orderId } = req.body; // 아이디 받아오기
    const order = await Order.findById(orderId);
    const orderUser = await Order.findById(order.userId);
    order.status = "delivered";
    order.save();
    
    await invalidateOnGoingOrdersCache(order.userId,redisCli);

    // const notipayload ={
    //     title: `라이더가 고객에게 이동 중입니다.`,
    //     body: `실시간 위치를 확인해보세요!`,
    //     data: {type:"order_onGoing", orderId:orderId},
    //   }
    //   if (orderUser.fcmToken) {
    //     //orderUser.fcmToken 로 변경해야함 잘 작동하면
    //     //await sendPushNotification(orderUser.fcmToken, notipayload);
    //   } else {
    //     console.log(`사용자 ${userId}의 FCM 토큰이 없습니다.`);
    //   }

}

 
module.exports = {
  goToCafeHandler,
  makingMenuHandler,
  goToClientHandler,
  completeOrderHandler,
};