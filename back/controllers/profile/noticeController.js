const Notice = require('../../models/Notice');
//const User = require("../../models/User");

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
    res.status(201).json({ notice });
  } catch (error) {
    res.status(500).json({ message: '공지사항 생성 실패', error });
  }
};

module.exports = {
    getNotices,
    createNotice,

}