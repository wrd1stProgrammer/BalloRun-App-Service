// models/Verification.js
const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  idImage: { type: String, required: true }, // 주민등록증 이미지 URI
  faceImage: { type: String, required: false }, // 본인 사진 URI -> 배포시 true로 
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected','notSubmitted'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

module.exports = mongoose.model('Verification', verificationSchema);