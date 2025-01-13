const mongoose = require('mongoose');


// !! 완벽 X 
/*
라이더가 배달중,배달 완료한 데이터 상태를 조회할 Rider 의 모델
*/
const RiderOrderSchema = new mongoose.Schema(
  {
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 라이더 ID
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // 매칭된 주문 ID
    status: {
      type: String,
      enum: ['pending', 'inProgress', 'completed', 'cancelled'], // 배달 상태
      default: 'pending',
    },
    assignedAt: { type: Date, default: Date.now }, // 배달이 라이더에게 할당된 시간
    completedAt: { type: Date }, // 배달 완료 시간
    cancelledAt: { type: Date }, // 배달 취소 시간
    notes: { type: String }, // 추가적인 메모 또는 이유 (취소 이유 등)
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const RiderOrder = mongoose.model('RiderOrder', RiderOrderSchema);
module.exports = RiderOrder;
