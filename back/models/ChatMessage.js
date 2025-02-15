const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true }, // 채팅방 ID
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 메시지 보낸 사람
    content: { type: String, required: false }, // 메시지 내용
    imageUrl: { type: String, default: "" }, // 이미지 URL (이미지 메시지)
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // createdAt 자동 생성 (메시지 전송 시간)
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
module.exports = ChatMessage;
