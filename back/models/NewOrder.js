const mongoose = require('mongoose');

const NewOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 주문한 사용자
    name: { type: String, required: true }, // 편의점 약국 마트 이런 배달 대분류 이름
    orderDetails: { type: String, required: true }, // 주문 상세 내용
    priceOffer: { type: Number, required: true }, // 상품 가격
    deliveryFee: { type: Number, required: true }, // 배달 팁
    riderRequest: { type: String, required: false }, // 추가 요청사항
    images: { type: String }, // 주문한 상품에 관한 설명 사진
    orderImages: { type: String }, // 픽업할 위치 상세 사진
    lat: { type: String, required: true }, // 위도
    lng: { type: String, required: true }, // 경도
    deliveryType: {
      type: String,
      enum: ['direct', 'nonContact'], // 배달 방법 (직접, 비대면)
      required: true,
    },
    pickupTime: { type: Date, required: true }, // 픽업 시간
    deliveryAddress: { type: String, required: true }, // 배달 상세 주소
    pickupTimeDisplay: { type: String, required: true }, // 픽업 시간 표시
    status: {
      type: String,
      enum: ['pending', 'matched','accepted', 'inProgress', 'delivered', 'cancelled','matchFailed','complete','goToCafe','makingMenu','goToClient'], // 주문 상태
      default: 'pending',
    },
    isReservation: {
        type: Boolean,
        default: false,
      },
    orderType: {
        type: String,
        default: "NewOrder"
    },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // 배달 라이더
    createdAt: { type: Date, default: Date.now }, // 생성 시간
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const NewOrder = mongoose.model('NewOrder', NewOrderSchema);
module.exports = NewOrder;