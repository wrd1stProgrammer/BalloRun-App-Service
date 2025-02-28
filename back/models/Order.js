const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 주문한 사용자
    name: { type: String, default: '카페'
    }, // 주문한 사용자
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
          quantity: {type: Number}
        },
      ],
      required: true,
    },
    lat: { type: String, required: true }, // 위도
    lng: { type: String, required: true }, // 경도
    resolvedAddress:{type: String, required: true}, // 위도 경도를 주소로 한거
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
      enum: ['pending', 'matched','accepted', 'inProgress', 'delivered', 'cancelled','matchFailed','complete','goToCafe','makingMenu','goToClient'], // 주문 상태
      default: 'pending',
    },
    cancellation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderCancellation',
      required: false, // 취소 데이터가 있을 경우 참조
    },
    // goToCafe : 카페가는중, makingMenu:제조중 , goToClient: 고객에게 가는중
    orderImages: { type: String }, // 픽업할 위치 상세 사진
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // 배달 라이더
    createdAt: { type: Date, default: Date.now }, // 생성 시간
    riderRequest: {type:String},
    selectedImageUri: {type:String},
    isReservation: {
      type: Boolean,
      default: false,
    },
    orderType: {
      type: String,
      default: "Order"
  },
    price:{type:Number},
    quantity:{type:Number},
    expectedTime:{type:Number}, // rider가 설정
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
