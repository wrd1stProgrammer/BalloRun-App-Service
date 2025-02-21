const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/User");
const Verification = require("../../models/Verification");
const { default: mongoose } = require("mongoose");

// Get user profile
const getProfile = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  try {

    res.status(StatusCodes.OK).json({
      user: {
        username: user.username,
        _id: user._id,
        userId: user.userId,
        userImage: user?.userImage,
        point: user.point,
        email: user.email,
        isRider: user.isRider,
        isDelivering: user.isDelivering,
        verificationStatus:user.verificationStatus,

      }, // 임시로 4개만 뿌림.
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
};


// Update user profile
const updateProfile = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { username, email, userImage } = req.body;

  if (!username && !email && !userImage) {
    throw new BadRequestError("No Update Fields provided");
  }

  try {
    if (username) user.name = name;
    if (email) user.bio = bio;
    if (userImage) user.userImage = userImage;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Profile updated successfully" });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

const saveVerification = async (req, res) => {
  //const { idImage, faceImage } = req.body;
  const { idImage } = req.body;
  const userId = req.user?.userId; // JWT 토큰에서 추출 (인증 미들웨어 필요)
  console.log(userId, 'userId 문제?');

  // 지금 사진 못 직으니 임시 주석
  /*
  if (!idImage || !faceImage) {
    return res.status(400).json({ message: 'Both idImage and faceImage are required' });
  } */

  try {
    // 사용자 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verification 생성 및 저장 -> faceImage 배포시 추가
    const verification = new Verification({
      userId,
      idImage,
      status: 'pending',
    });
    await verification.save();

    // User 상태 업데이트
    user.verificationStatus = 'pending';
    //user.isRider = true; // 임시 로직 원래 관리자가 승인 해야됨.
    await user.save();

    res.status(200).json({ message: '라이더 인증 요청이 성공 됨.', verificationId: verification._id });
  } catch (error) {
    console.error('Error in saveVerification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = {
  getProfile,
  updateProfile,
  saveVerification
};