const Notice = require('../../models/Notice');
const User = require("../../models/User");
const { sendPushNotification } = require("../../utils/sendPushNotification");

// 공지사항 조회
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ message: '공지사항 조회 실패', error });
  }
};

// 공지사항 생성 (관리자만)
const createNotice = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { title, content } = req.body;

    const notice = new Notice({
      title,
      content,
      author: userId,
    });

    await notice.save();

    // 모든 유저에게 알림 발송
    const allUsers = await User.find({ allOrderAlarm: true, fcmToken: { $ne: null } });

    const notificationPayload = {
      title: "새 공지사항이 등록되었습니다!",
      body: title,
      data: { type: "order_failed" },
    };

    for (const user of allUsers) {
      try {
        await sendPushNotification(user.fcmToken, notificationPayload);
        //console.log(`유저 ${user._id}에게 공지 알림 전송 성공`);
      } catch (notificationError) {
        console.error(`유저 ${user._id}에게 공지 알림 전송 실패:`, notificationError);
      }
    }

    res.status(201).json({ notice });
  } catch (error) {
    console.error("공지사항 생성 실패:", error);
    res.status(500).json({ message: '공지사항 생성 실패', error });
  }
};


module.exports = {
    getNotices,
    createNotice,

}