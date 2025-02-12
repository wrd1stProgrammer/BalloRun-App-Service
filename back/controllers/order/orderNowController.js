const Order = require("../../models/Order");
const User = require("../../models/User");
const amqp = require("amqplib");
const {connectRabbitMQ} = require("../../config/rabbitMQ");


const orderNowDirectCreate = async (req, res) => {
  //요청사항 추가
  const { items, lat, lng, isMatch, deliveryFee, deliveryType,startTime,endTime,riderRequest,selectedFloor,price,quantity } = req.body;

  const userId = req.user.userId; // authMiddleWare 에서 가져옴.

  
  try {
    // 배달 타입이 'direct'인지 확인
    if (deliveryType === "direct") {

       // RabbitMQ 연결
       const {channel,connection} = await connectRabbitMQ();
      
       const queue = "order_queue";
 
       await channel.assertQueue(queue, { durable: true });

      const message = JSON.stringify({
        userId: userId, // authMiddleware로 사용자 확인
        items,
        lat,
        lng,
        isMatch,
        deliveryFee,
        deliveryType,
        startTime,
        endTime, 
        riderRequest, // 배달원 요청사항
        selectedFloor,
        price,
        quantity,
        price,
        quantity,
      });
// 메시지 큐에 전송
channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

console.log("큐에 전달-지금직접배달:", message);

// 클라이언트에 즉시 응답
res.status(201).json({ message: "Order received and being processed." });



// 연결 종료
setTimeout(() => {
    channel.close();
}, 1000); 

    } else if (deliveryType === "cupHolder") {

      // RabbitMQ 연결
       const {channel,connection} = await connectRabbitMQ();
      
       const queue = "order_queue";
 
       await channel.assertQueue(queue, { durable: true });


      const message = JSON.stringify({
        userId: userId, // authMiddleware로 사용자 확인
        items,
        lat,
        lng,
        isMatch,
        deliveryFee,
        deliveryType, 
        startTime,
        endTime, 
        riderRequest,// 배달원 요청사항
        selectedFloor,
        price,
        quantity,
      });

      // 메시지 큐에 전송
channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

console.log("큐에 전달-지금직접배달:", message);


// 클라이언트에 즉시 응답
res.status(201).json({ message: "Order received and being processed." });

// 연결 종료
setTimeout(() => {
    channel.close();
}, 1000); 


    } else {
      return res.status(400).json({ message: "잘못된 배달 타입입니다." });
    }
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return res.status(500).json({ message: "주문 생성에 실패했습니다." });
  }
};


// 매치 부분이라 코드 분리 해야할 것 같은데
const matchRider = async (req, res) => {
  const { orderId, riderId } = req.body; // 주문자 라이더

  try {
    const order = await Order.findById(orderId); // 주문자 모델 찾기
    if (!order)
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });

    order.status = "matched"; // 매칭상태 업데이트
    // + 매칭 됐다고 orderId, riderId 에 socket 처리..?
    // 
    order.riderId = riderId; // 라이더ID 지정.
    await order.save();


    res.status(200).json(order);
  } catch (error) {
    console.error("배달자 매칭 실패:", error);
    res.status(500).json({ message: "배달자 매칭에 실패했습니다." });
  }
};

module.exports = {
  orderNowDirectCreate,
  matchRider,
};
