const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [
        {
          cafeName: { type: String, required: true },
          menuName: { type: String, required: true },
          price: { type: Number, required: true },
          description: { type: String },
          imageUrl: { type: String }, // Cloudinary URL
        },
      ], // 주문 아이템 배열
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
    pickupTime: { type: Date, required: false }, // 예약 배달일 경우 픽업 시간
    createdAt: { type: Date, default: Date.now }, // 생성 시간
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
