const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델과 참조
    required: true
  },
  withdrawAmount: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  },
  origin:{
    type:Number,
    required: false,
  }, // 나중에 true
  fromPoint: { type: Number, required: true }, // 포인트 출금액
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 모델 생성
const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
module.exports = Withdrawal;