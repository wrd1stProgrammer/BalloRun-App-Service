const ChatRoom = require("../../models/ChatRoom"); // ChatRoom 모델 import
const Report = require("../../models/Report");
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

const reportChatApi = async (req, res) => {
  const { reason, username, chatRoomId } = req.body;
  const reporter = req.user.userId; // 요청한 사용자 ID (인증 미들웨어에서 제공된다고 가정)

  try {
    // reporter가 없는 경우 (인증되지 않은 사용자)
    if (!reporter) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 채팅방 존재 여부 확인
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ message: '채팅방을 찾을 수 없습니다.' });
    }

    // 중복 신고 여부 확인
    const existingReport = await Report.findOne({
      reporter,
      chatRoomId,
    });
    if (existingReport) {
      return res.status(409).json({ message: '이미 이 채팅방을 신고하셨습니다.' });
    }

    // 신고 데이터 저장
    const report = new Report({
      reason,
      reportedUser: username, // 신고 당한 사람
      chatRoomId,
      reporter, // 신고한 사람
      reportedAt: new Date(),
    });
    await report.save();

    res.status(200).json({ message: '신고가 접수되었습니다.' });
  } catch (error) {
    console.error('신고 처리 중 오류:', error);
    res.status(500).json({ message: '신고 처리 중 오류가 발생했습니다.' });
  }
};

module.exports = {
    deleteChatRoom,
    checkChatRoomApi,
    toggleChatRoomAlarm,
    reportChatApi,
}