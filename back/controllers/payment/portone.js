const Notice = require('../../models/Notice');
const User = require("../../models/User");
const mongoose = require("mongoose");
const NewOrder = require("../../models/NewOrder");


const completePayment = async (req, res) => {
    try {
      const { paymentId, orderId } = req.body;
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
        return res.status(404).send('Order not found');
      }
      console.log('payment: ',payment);
      // 금액 비교
      if (1 === payment.amount.total) {
        switch (payment.status) {
          case 'VIRTUAL_ACCOUNT_ISSUED':
            return res.status(200).send('Virtual account issued');
          case 'PAID':
            orderData.status = 'PAID'; // 주문 상태 업데이트
            await orderData.save();
            return res.status(200).send('Payment completed');
          default:
            return res.status(400).send('Unknown payment status');
        }
      } else {
        return res.status(400).send('Payment amount mismatch');
      }
    } catch (e) {
      res.status(500).send(`Server error: ${e.message}`);
    }
  };
  

  module.exports = { completePayment };