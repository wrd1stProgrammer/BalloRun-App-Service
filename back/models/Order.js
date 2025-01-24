const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 주문한 사용자
    items: {
      type: [
        {
          cafeName: { type: String, required: true },
          menuName: { type: String, required: true },
          price: { type: Number, required: true },
          description: { type: String },
          imageUrl: { type: String }, // Cloudinary URL
          RequiredOption: { type: String, required: true }, // 필수 옵션
          AdditionalOptions: { type: [String], required: false }, // 추가 옵션
        },
      ],
      required: true,
    },
    lat: { type: String, required: true }, // 위도
    lng: { type: String, required: true }, // 경도
    isMatch: { type: Boolean, default: false }, // 매칭 상태
    deliveryType: {
      type: String,
      enum: ['direct', 'cupHolder'], // 배달 타입 (직접, 컵홀더)
      required: true,
    },
    startTime: { type: Date, required: false }, // 예약 배달일 경우 희망 픽업 시간
    endTime: { type: Date, required: false }, // 예약 배달일 경우 희망 픽업 시간
    deliveryFee: { type: Number, required: false, default: 0 }, // 배달 수수료
    status: {
      type: String,
      enum: ['pending', 'matched', 'accepted', 'inProgress', 'delivered', 'cancelled','matchFailed'], // 주문 상태
      default: 'pending',
    },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // 배달 라이더
    createdAt: { type: Date, default: Date.now }, // 생성 시간
    riderRequest: {type:String},
    selectedFloor: {type:String}
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
