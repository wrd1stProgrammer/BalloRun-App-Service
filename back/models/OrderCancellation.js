const mongoose = require('mongoose');

const OrderCancellationSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'orderType', // 동적 참조를 위해 refPath 사용
  },
  orderType: {
    type: String,
    enum: ['Order', 'NewOrder'],
    required: true,
  },
  cancelReason: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true, // 결제 금액
  },
  refundAmount: {
    type: Number,
    required: true, // 환불 금액
  },
  penaltyAmount: {
    type: Number,
    default: 0, // 패널티 금액
  },
  cancelStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending', // 취소 상태
  },
  cancelledAt: {
    type: Date,
    default: Date.now, // 취소 요청 시간
  },
  riderNotified: {
    type: Boolean,
    default: false, // 라이더에게 알림 전송 여부
  },
}, {
  timestamps: true,
});

const OrderCancellation = mongoose.model('OrderCancellation', OrderCancellationSchema);
module.exports = OrderCancellation;