const mongoose = require('mongoose');


// 탈퇴 이유 모델


const withdrawalReasonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('WithdrawalReason', withdrawalReasonSchema);