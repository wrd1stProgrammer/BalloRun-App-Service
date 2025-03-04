const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 참여자들
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", unique: true }, // 주문과 연결
    title: { type: String, required: true }, // 채팅방 이름
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 채팅방 참여자들
    lastMessage: { type: String, default: "" }, // 마지막 메시지
    lastMessageAt: { type: Date, default: Date.now }, // 마지막 메시지 시간
    isAlarm: { type: Boolean, default: true }, // 알림 설정 여부
    image: { type: String, default: "" }, // 채팅방 대표 이미지
  },
  { timestamps: true } // createdAt, updatedAt 자동 생성
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
