const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/User");
const Verification = require("../../models/Verification");
const Withdrawal = require("../../models/Withdrawl");
const WithdrawalReason = require("../../models/WithdrawlReason");
const {sendPushNotification} = require("../../utils/sendPushNotification");
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
        admin:user.admin,
        exp:user.exp,
        level:user.level,
        userId: user.userId,
        nickname: user?.nickname,
        userImage: user?.userImage,
        point: user.point,
        originalMoney: user.originalMoney,
        email: user.email,
        isRider: user.isRider,
        isDelivering: user.isDelivering,
        verificationStatus:user.verificationStatus,
        account: user.account ?? null, // account가 undefined일 경우 null로 처리
        allOrderAlarm: user.allOrderAlarm,
        allAdAlarm : user.allAdAlarm,
        allChatAlarm: user.allChatAlarm,
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
  const { idImage, faceImage } = req.body;

  const userId = req.user?.userId; // JWT 토큰에서 추출 (인증 미들웨어 필요)

  // 지금 사진 못 찍으니 임시 주석
  
  if (!idImage || !faceImage) {
    return res.status(400).json({ message: 'Both idImage and faceImage are required' });
  } 

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
      faceImage,
      status: 'pending',
    });
    await verification.save();

    // User 상태 업데이트
    user.verificationStatus = 'pending';
    //user.isRider = true; // 임시 로직 원래 관리자가 승인 해야됨.
    await user.save();

    // --------------- (여기서부터 관리자 알림) ---------------
    try {
      const admins = await User.find({ admin: true, fcmToken: { $exists: true, $ne: null } });
      const adminPayload = {
        title: `[관리자] 라이더 인증 신청`,
        body: `${user.username || user._id}님의 라이더 인증 신청이 도착했습니다.`,
        data: { type: "admin_verification_request", verificationId: verification._id.toString() },
      };
      for (const admin of admins) {
        try {
          await sendPushNotification(admin.fcmToken, adminPayload);
          console.log(`관리자 ${admin.username || admin._id}에게 인증신청 알림 전송 완료`);
        } catch (err) {
          console.error(`관리자 ${admin.username || admin._id} 인증신청 알림 실패:`, err);
        }
      }
    } catch (err) {
      console.error("관리자 인증신청 알림 전송 실패:", err);
    }
    // -------------------------------------------------------

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
    if (!user) throw new NotFoundError("User not found");

    // 2. 입력 검증 (프론트의 파라미터 이름에 맞춰 수정)
    const { request, fromOrigin, fromPoint, fee, finalAmount } = req.body;
    if (
      typeof request !== 'number' ||
      typeof fromOrigin !== 'number' ||
      typeof fromPoint !== 'number' ||
      typeof fee !== 'number' ||
      typeof finalAmount !== 'number'
    ) {
      throw new BadRequestError("필수 입력값 누락 또는 형식 오류");
    }

    // 3. 로직 체크
    if (request !== fromOrigin + fromPoint) {
      throw new BadRequestError("출금 금액이 원금+포인트 합과 다릅니다.");
    }
    if (fromOrigin > user.originalMoney) {
      throw new BadRequestError("원금이 부족합니다.");
    }
    if (fromPoint > user.point) {
      throw new BadRequestError("포인트가 부족합니다.");
    }
    if (request > user.originalMoney + user.point) {
      throw new BadRequestError("출금 요청 금액이 전체 잔액을 초과합니다.");
    }

    // 4. 출금 요청 생성
    const withdrawal = new Withdrawal({
      userId: user._id,
      withdrawAmount: request,
      fee,
      finalAmount,
      origin: fromOrigin,
      fromPoint,
      status: 'pending',
    });
    await withdrawal.save();

    // 5. 사용자 잔액 업데이트
    user.originalMoney -= fromOrigin;
    user.point -= fromPoint;
    await user.save();

    // 6. 관리자에게 출금신청 알림 전송 (추가)
    try {
      const admins = await User.find({ admin: true, fcmToken: { $exists: true, $ne: null } });
      const adminPayload = {
        title: `[관리자] 출금신청 도착`,
        body: `${user.username}님의 ${request.toLocaleString()}원 출금신청이 들어왔습니다.`,
        data: { type: "admin_withdrawal_request", withdrawalId: withdrawal._id.toString() },
      };
      for (const admin of admins) {
        try {
          await sendPushNotification(admin.fcmToken, adminPayload);
          console.log(`관리자 ${admin.username} (${admin._id})에게 출금 알림 전송 완료`);
        } catch (err) {
          console.error(`관리자 ${admin.username} 출금 알림 실패:`, err);
        }
      }
    } catch (err) {
      console.error("관리자 출금 알림 전송 실패:", err);
    }

    // 7. 응답
    res.status(StatusCodes.OK).json({
      msg: "출금 요청이 성공적으로 접수되었습니다.",
      withdrawal: {
        id: withdrawal._id,
        status: withdrawal.status,
        finalAmount: withdrawal.finalAmount,
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

// controllers/withdrawController.js
const getWithdrawList = async (req, res) => {
  try {
    /* 1) 인증 */
    const token = req.headers.authorization?.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    /* 2) DB 조회 - origin(원금)까지 가져오기 */
    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 })
      .select('withdrawAmount origin fee finalAmount status createdAt'); // ← origin 추가

    /* 3) 응답용 변환 */
    const formatted = withdrawals.map((w) => ({
      id: w._id.toString(),
      date: w.createdAt.toISOString().split('T')[0],
      origin: `₩${(w.origin ?? 0).toLocaleString()}`,        // ● 원금
      amount: `₩${w.finalAmount.toLocaleString()}`,           // 환전액(수수료 차감 후)
      status: w.status === 'pending' ? '처리중 (24시간 내 완료)' : '완료',
    }));

    res.status(StatusCodes.OK).json({ withdrawals: formatted });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};


const editProfile = async (req, res) => {
  console.log('editProfile');
  const userId = req.user.userId;

  // 사용자 조회
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { username, nickname, userImage } = req.body;

  // null이 아닌 경우에만 필드 업데이트
  if (username !== null && username !== undefined) user.username = username;
  if (nickname !== null && nickname !== undefined) user.nickname = nickname;
  if (userImage !== null && userImage !== undefined) user.userImage = userImage;

  await user.save();

  res.status(StatusCodes.OK).json({ 
    msg: "Profile updated successfully"
  });
};

const updateAddress = async (req, res) => {
  try {
      const { address, lat, lng } = req.body;      // ★lat,lng 추가
      const { id } = req.params; // `req.user.userId` 대신 `req.params.id` 사용
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "잘못된 사용자 ID 형식입니다." });
      }

      if (!address) {
          return res.status(400).json({ message: "주소를 입력하세요." });
      }

      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      user.address = address;
    // GeoJSON 포맷으로 저장
      user.location = {
       type: 'Point',
       coordinates: [lng, lat],
      };

      await user.save();

      res.status(200).json({ message: "주소가 업데이트되었습니다.", address: user.address });
  } catch (error) {
      console.error("주소 업데이트 오류:", error);
      res.status(500).json({ message: "서버 오류" });
  }
};

const taltaeApi = async (req, res) => {
  try {
    const user = req.user.user; 
    const userId = user._id;
    const { reason } = req.body;

    // 탈퇴 사유 
    await WithdrawalReason.create({
      userId,
      reason,
      createdAt: new Date(),
    });

    const timestamp = Date.now();
    user.username = `탈퇴한 사용자_${timestamp}`;
    user.nickname = '탈퇴한 사용자';
    
    user.isActive = false; // 소프트 삭제 (법때매 실제 삭제아닌 삭제 상태)
    user.deletedAt = new Date();
    await user.save();

    // 관련 데이터 삭제 또는 비활성화 -> 미정이
    // await Post.updateMany({ userId }, { isDeleted: true });
    // await Chat.updateMany({ userId }, { isDeleted: true });

    // 성공 응답
    res.status(200).json({ message: '탈퇴가 완료되었습니다.', user: user });
  } catch (error) {
    console.error('탈퇴 처리 오류:', error);
    res.status(500).json({ message: '서버 오류로 탈퇴에 실패했습니다.' });
  }
};

const accountUpdate = async(req,res) => {
  try {
    const userId = req.user.userId; // authMiddleware에서 추출된 사용자 ID
    const { bankName, accountNumber, holder } = req.body;

    // 필수 필드 검증
    if (!bankName || !accountNumber || !holder) {
      return res.status(400).json({ message: '모든 계좌 정보를 입력해주세요.' });
    }

    // 사용자 조회
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 계좌 정보 업데이트
    user.account = {
      bankName,
      accountNumber,
      holder,
    };

    await user.save();

    res.status(200).json({
      message: '계좌 정보가 성공적으로 업데이트되었습니다.',
      user: {
        _id: user._id,
        account: user.account,
        // 필요한 다른 필드 추가
      },
    });
  } catch (error) {
    console.error('계좌 정보 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }

}

const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.userId; // authMiddleware에서 추출된 사용자 ID

    const { allChatAlarm, allAdAlarm, allOrderAlarm } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        allChatAlarm,
        allAdAlarm,
        allOrderAlarm,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Notification settings updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  saveVerification,
  registerAccountApi,
  withdrawApi,
  getWithdrawList,
  editProfile, 
  updateAddress,
  taltaeApi,
  accountUpdate,
  updateNotificationSettings
};