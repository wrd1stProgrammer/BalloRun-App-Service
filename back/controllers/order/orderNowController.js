const Order = require("../../models/Order");
const User = require("../../models/User");
// const io = require("socket.io")(server); // 또는 app.get('io')를 사용할 수도 있음

const orderNowDirectCreate = async (req, res) => {
  const { items, lat, lng, isMatch, deliveryType, pickupTime } = req.body;

  const userId = req.user.userId; // authMiddleWare 에서 가져옴.
  console.log(userId);

  try {
    // 배달 타입이 'direct'인지 확인
    if (deliveryType === "direct") {
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

      // 주문 생성 이벤트를 모든 클라이언트에 방송
      const io = req.app.get("io"); // !!app에 저장된 io 객체 가져오기 -> 수정할 수도 있음.
      io.emit("orderCreated", savedOrder);
      /*
      emit -> orderCreated 이름으로 요청한다고 생각 savedOrder 데이터를 가지고
      client 에서 io.on("orderCreated",...) -> emit 한 내용을 받는다는 의미 on이
      주문요청(생성) 하면 Socket을 통해 완료가 됐을때 배달내역 screen 으로 이동하기 위해사용함.
      */


      return res.status(201).json(savedOrder);
    } else if (deliveryType === "cupHolder") {
      // cupHolder 배달 처리 로직
      return res
        .status(400)
        .json({ message: "현재 cupHolder 배달 타입은 지원하지 않습니다." });
    } else {
      return res.status(400).json({ message: "잘못된 배달 타입입니다." });
    }
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return res.status(500).json({ message: "주문 생성에 실패했습니다." });
  }
};

const matchRider = async (req, res) => {
  const { orderId, riderId } = req.body; // 주문자 라이더

  try {
    const order = await Order.findById(orderId); // 주문자 모델 찾기
    if (!order)
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });

    order.status = "matched"; // 매칭상태 업데이트
    order.riderId = riderId; // 라이더ID 지정.
    await order.save();

    // 주문자와 라이더의 룸 설정
    const io = req.app.get("io"); // app에 저장된 io 객체 가져오기
    const userRoom = order.userId; // 주문자의 룸
    const riderRoom = riderId; // 라이더의 룸

    // 주문자와 라이더에게 상태 업데이트 알림
    io.to(userRoom).emit("orderMatched", {
      orderId,
      riderId,
      status: order.status,
    });
    io.to(riderRoom).emit("orderMatched", {
      orderId,
      userId: order.userId,
      status: order.status,
    });

    /*
     임시 matchRider 로직
     1. 라이더가 주문 수락시 order.status = "matched";(59줄) order상태 업데이트
     2. riderId 를 주문 model 에서 업데이트
     3. .emit("orderMatched",...) 이건 주문이 매칭 됐다는 것을 주문자와 라이더에게
        실시간으로 알려줌 
     4. orderMatched 를 .on 으로 받았다면 그때 주문자와 라이더의 screen,상태 업데이트

     */

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
