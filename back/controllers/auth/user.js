const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/User");
const Verification = require("../../models/Verification");
const Withdrawal = require("../../models/Withdrawl");
const { default: mongoose } = require("mongoose");

// Get user profile
const getProfile = async (req, res) => {
  console.log('getProfile')
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
        exp:user.exp,
        level:user.level,
        userId: user.userId,
        userImage: user?.userImage,
        point: user.point,
        email: user.email,
        isRider: user.isRider,
        isDelivering: user.isDelivering,
        verificationStatus:user.verificationStatus,
        account: user.account ?? null, // account가 undefined일 경우 null로 처리
      }, // 임시로 4개만 뿌림.
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
};


// Update user profile
const updateProfile = async (req, res) => {
  console.log('updateProfile')
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
    //if (username) user.name = name;
    //if (email) user.bio = bio;
    //if (userImage) user.userImage = userImage;

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

const registerAccountApi = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { bankName, accountNumber, holder } = req.body;

    if (!bankName || !accountNumber || !holder) {
      throw new BadRequestError("은행명, 계좌번호, 예금주는 모두 필수 입력값입니다.");
    }

    user.account = {
      bankName: bankName.trim(),
      accountNumber: accountNumber,
      holder: holder.trim(),
    };

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "계좌가 성공적으로 등록되었습니다.", user: { account: user.account } });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: error.message });
    }
  }
};

const withdrawApi = async (req, res) => {
  try {
    // 1. 인증 및 사용자 확인
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // 2. 입력 검증
    const { withdrawAmount, fee, finalAmount } = req.body;
    if (!withdrawAmount || !fee || !finalAmount) {
      throw new BadRequestError("출금 금액, 수수료, 최종 출금 금액은 모두 필수 입력값입니다.");
    }

    // 3. 잔액 확인
    if (withdrawAmount > user.point) {
      throw new BadRequestError("출금 요청 금액이 사용자 잔액을 초과합니다.");
    }

    // 4. 출금 요청 생성
    const withdrawal = new Withdrawal({
      userId: user._id,
      withdrawAmount,
      fee,
      finalAmount,
      status: 'pending'
    });
    await withdrawal.save();

    // 5. 사용자 잔액 업데이트
    user.point -= withdrawAmount;
    await user.save();

    // 6. 응답
    res.status(StatusCodes.OK).json({
      msg: "출금 요청이 성공적으로 접수되었습니다.",
      withdrawal: {
        id: withdrawal._id,
        status: withdrawal.status,
        finalAmount: withdrawal.finalAmount
      }
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: error.message });
    }
  }
};

// getWithdrawList API 추가
const getWithdrawList = async (req, res) => {
  try {
    // 1. 인증 및 사용자 확인
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    // 2. 출금 내역 조회
    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 }) // 최신순 정렬
      .select("withdrawAmount fee finalAmount status createdAt"); // 필요한 필드만 선택

    // 3. 데이터 형식화
    const formattedWithdrawals = withdrawals.map((w) => ({
      id: w._id.toString(),
      date: w.createdAt.toISOString().split("T")[0], // YYYY-MM-DD 형식
      amount: `₩${w.withdrawAmount.toLocaleString()}`,
      status:
        w.status === "pending" ? "처리중 (24시간 내 처리 완료)" : "완료",
    }));

    // 4. 응답
    res.status(StatusCodes.OK).json({ withdrawals: formattedWithdrawals });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error: error.message });
    }
  }
};



module.exports = {
  getProfile,
  updateProfile,
  saveVerification,
  registerAccountApi,
  withdrawApi,
  getWithdrawList,
};