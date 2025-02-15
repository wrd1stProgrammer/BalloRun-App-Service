const ChatRoom = require("../../models/ChatRoom"); // ChatRoom 모델 import


const deleteChatRoom = async (req,res) => {
    const {chatRoomId} = req.params;
  try {
    // 채팅방 삭제
    const result = await ChatRoom.findByIdAndDelete(chatRoomId);

    // 삭제 결과 확인
    if (result) {
      console.log("채팅방이 삭제되었습니다:", result);
      return res.json('true');
    } else {
      console.log("채팅방을 찾을 수 없습니다.");
      return res.json('false');
    }
  } catch (error) {
    console.error("채팅방 삭제 중 오류 발생:", error);
    return res.json('false');
  }
};

module.exports = {
    deleteChatRoom,
}