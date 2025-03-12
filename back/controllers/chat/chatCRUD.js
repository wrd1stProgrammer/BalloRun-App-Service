const ChatRoom = require("../../models/ChatRoom"); // ChatRoom 모델 import
const { BadRequestError,UnauthenticatedError,} = require("../../errors");

const { default: mongoose } = require("mongoose");

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

const toggleChatRoomAlarm = async (req, res) => {
  try {
    const { id: chatRoomId } = req.params; // URL에서 chatRoomId 추출
    const userId = req.user.userId; // auth 미들웨어에서 추출된 사용자 ID

    // 채팅방 존재 여부 확인
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new BadRequestError('채팅방을 찾을 수 없습니다.');
    }

    // 사용자가 채팅방에 속해 있는지 확인
    if (!chatRoom.users.some((user) => user.toString() === userId)) {
      throw new UnauthenticatedError('채팅방에 속해 있지 않습니다.');
    }

    // 사용자별 알림 설정 업데이트
    const userAlarm = chatRoom.usersAlarm.find((alarm) => alarm.userId.toString() === userId);
    if (userAlarm) {
      userAlarm.isAlarm = !userAlarm.isAlarm; // 토글
    } else {
      chatRoom.usersAlarm.push({ userId: new mongoose.Types.ObjectId(userId), isAlarm: false });
    }

    await chatRoom.save();

    console.log(chatRoom,'update chatroom화긴');



    // res.status(StatusCodes.OK).json({ chatRoomList });
  } catch (error) {
    console.error('알림 설정 업데이트 오류:', error);
    if (error instanceof BadRequestError || error instanceof UnauthenticatedError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '서버 오류로 알림 설정에 실패했습니다.' });
  }
};

module.exports = {
    deleteChatRoom,
    checkChatRoomApi,
    toggleChatRoomAlarm,
}