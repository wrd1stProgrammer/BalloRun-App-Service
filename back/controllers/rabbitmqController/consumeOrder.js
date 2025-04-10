const amqp = require("amqplib");
const NewOrder = require("../../models/NewOrder");
const mongoose = require("mongoose");
const User = require("../../models/User");
const { storeOrderInRedis } = require("./storeOrderInRedis");
const { connectRabbitMQ } = require("../../config/rabbitMQ");
const { invalidateOnGoingOrdersCache } = require("../../utils/deleteRedisCache");
const { sendPushNotification } = require("../../utils/sendPushNotification");


const consumeNewOrderMessages = async (redisCli) => {
    try {
      const { channel } = await connectRabbitMQ();
      const cacheKey = `activeOrders`;
      const queue = "new_order_queue";
      const delayedExchange = "delayed_exchange";
      const deadLetterExchange = "dead_letter_exchange";
      const deadLetterQueue = "dead_letter_queue";
  
      // Dead-Letter Exchange와 Queue 설정
      await channel.assertExchange(deadLetterExchange, "direct", { durable: true });
      await channel.assertQueue(deadLetterQueue, { durable: true });
      await channel.bindQueue(deadLetterQueue, deadLetterExchange, deadLetterQueue);
  
      // 원래 큐에 DLX 설정 추가
      await channel.assertQueue(queue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": deadLetterExchange,
          "x-dead-letter-routing-key": deadLetterQueue,
        },
      });
  
      await channel.assertExchange(delayedExchange, "x-delayed-message", {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
      });
      console.log(`New Waiting for messages in ${queue}`);
  
      channel.consume(
        queue,
        async (msg) => {
          if (msg) {
              //3줄 추가됨.
              const session = await mongoose.startSession();
              session.startTransaction();
              let newOrder;
            try {
              const orderData = JSON.parse(msg.content.toString());
              const { paymentId,userId, name, orderDetails, priceOffer, deliveryFee, ...rest } = orderData;
              console.log(orderData,'orderData검증');
              
              const newOrder = new NewOrder({
                ...orderData,
                usedPoints: orderData.usedPoints || 0,
              });
              await newOrder.save({ session });
              //await newOrder.save();

              // 결제 검증
              const paymentResult = await verifyPayment(paymentId, newOrder._id);
              if (!paymentResult) {
                throw new Error("결제 검증 실패");
              }
              // 결제 상태에 따라 주문 상태 업데이트
              newOrder.status = paymentResult.status;
              await newOrder.save({ session });
  
              const transformedOrder = {
                _id: newOrder._id,
                name: newOrder.name,
                items: [{ menuName: newOrder.orderDetails, cafeName: newOrder.name }],
                deliveryType: newOrder.deliveryMethod,
                startTime: newOrder.startTime,
                deliveryFee: newOrder.deliveryFee,
                price: newOrder.priceOffer,
                createdAt: newOrder.createdAt,
                endTime: newOrder.endTime,
                lat: newOrder.lat,
                lng: newOrder.lng,
                resolvedAddress: newOrder.resolvedAddress,
                deliveryAddress: newOrder.deliveryAddress,
                selectedFloor: newOrder.selectedFloor,
                isReservation: newOrder.isReservation,
                orderType: newOrder.orderType,
                usedPoints: newOrder.usedPoints,
              };
  
              const redisOrders = JSON.parse(await redisCli.get(cacheKey)) || [];
              redisOrders.push(transformedOrder);
              await redisCli.set(cacheKey, JSON.stringify(redisOrders), { EX: 120 });
  
              await invalidateOnGoingOrdersCache(orderData.userId, redisCli);
  
              await channel.publish(
                delayedExchange,
                "delayed_route.neworder",
                Buffer.from(JSON.stringify({ orderId: newOrder._id, type: "neworder" })),
                { headers: { "x-delay": 120000 }, persistent: true }
              );

              
              await session.commitTransaction();
              channel.ack(msg);
            } catch (error) {
                console.error("Error processing new order:", error);
                // 결제 검증 실패 시 주문 삭제
                if (newOrder && newOrder._id) {
                  await NewOrder.findByIdAndDelete(newOrder._id).session(session);
                  console.log(`주문 ${newOrder._id} 삭제됨 (결제 실패)`);
                }
    
                await session.abortTransaction();
                // 사용자에게 푸시 알림 전송
                try {
                  const orderData = JSON.parse(msg.content.toString());
                  const user = await User.findById(orderData.userId);
                  if (user?.fcmToken) {
                    const notipayload = {
                      title: `주문 처리 실패`,
                      body: `주문 처리에 문제가 발생했습니다. 다시 시도해주세요`,
                      data: { type: "order_failed"},
                    };
                    await sendPushNotification(user.fcmToken, notipayload);
                    console.log(`사용자 ${orderData.userId}에게 주문 처리 실패 알림 전송 완료`);
                  } else {
                    console.log(`사용자 ${orderData.userId}의 FCM 토큰이 없습니다.`);
                  }
                } catch (notificationError) {
                  console.error("푸시 알림 전송 실패:", notificationError);
                }
    
                channel.nack(msg, false, false); // 오류 시 메시지를 DLX로 보냄
            } finally{
              session.endSession();
            }
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("New order consumer error:", error);
    }
  };



  // 결제 검증 함수 
  const verifyPayment = async (paymentId,orderId) => {
    try {
      console.log(`${process.env.PORTONE_API_SECRET}`,'.env 잘 됐나ㅣ');
      // 포트원 결제 내역 단건 조회 API 호출 -> 이거 제대로!!!!!
      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
        {
          headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` },
        },
      );
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(`Payment API error: ${JSON.stringify(errorData)}`);
      }else{
        console.log('paymentResponse ok',paymentResponse);
      }
      const payment = await paymentResponse.json();
  
      // DB에서 주문 데이터 조회
      const orderData = await NewOrder.findById(orderId);
      if (!orderData) {
        throw new Error("Order not found");
      }
      
      let totalPayment = orderData.deliveryFee + orderData.priceOffer;
      console.log('payment: ',payment);
      // 금액 비교
      if (totalPayment === payment.amount.total) {
        switch (payment.status) {
          case 'VIRTUAL_ACCOUNT_ISSUED':
            throw new Error("VIRTUAL_ACCOUNT_ISSUED ERROR!!");
          case 'PAID':
            orderData.status = 'PAID'; // 주문 상태 업데이트
            await orderData.save();
            return { status: payment.status }; // "PAID", "VIRTUAL_ACCOUNT_ISSUED" 등
          default:
            throw new Error("unknow payment default error");
        }
      } else {
        throw new Error("Payment amount mismatch");
      }
    } catch (e) {
      throw new Error(`Server error: ${e.message}`);
    }
  };


  module.exports = {
    consumeNewOrderMessages,
  };