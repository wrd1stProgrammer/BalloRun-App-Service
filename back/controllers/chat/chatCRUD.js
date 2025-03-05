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

// 채팅방 존재 여부 확인 함수
const checkChatRoomApi = async (req, res) => {
  const { roomId } = req.query; 
  try {
    // roomId로 채팅방 조회
    const chatRoom = await ChatRoom.findById(roomId);

    // 채팅방 존재 여부 확인
    if (chatRoom) {
      console.log("채팅방이 존재합니다:", roomId);
      return res.json(1); // 존재하면 1 반환
    } else {
      console.log("채팅방이 존재하지 않습니다:", roomId);
      return res.json(0); // 존재하지 않으면 0 반환
    }
  } catch (error) {
    console.error("채팅방 존재 여부 확인 중 오류 발생:", error);
    return res.status(500).json(0); // 오류 발생 시 0 반환 (안전하게 기본값 설정)
  }
};

module.exports = {
    deleteChatRoom,
    checkChatRoomApi,
}