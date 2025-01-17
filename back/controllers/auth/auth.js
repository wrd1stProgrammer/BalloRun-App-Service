const User = require("../../models/User");
const Token = require("../../models/Token");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { email, userId, password, username } = req.body;

  try {
    // 이메일이 이미 존재하는지 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send('사용 중인 이메일 입니다.');
    }

    // 사용자가 이미 존재하는지 확인
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).send('사용 중인 ID 입니다.');
    }

        // 사용자 이름 중복 검사
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ message: "사용 중인 사용자 이름입니다." });
        }

    // 비밀번호 해싱 -> 보안 ISSUE 확인 !!
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = new User({
      email,
      userId,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const newRefreshToken = newUser.createRefreshToken();

    await Token.findOneAndUpdate(
      { email: newUser.email },
      { token: newRefreshToken },
      { upsert: true }
    );

    res.status(201).json({ newRefreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ userId });
    if (!user) {
      console.error('로그인 실패: 사용자 아이디 없음');
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('로그인 실패: 비밀번호 불일치');
      return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 액세스 토큰 및 리프레시 토큰 생성
    const newAccessToken = user.createAccessToken();
    const newRefreshToken = user.createRefreshToken();

    // 토큰 저장
    await Token.findOneAndUpdate(
      { email: user.email },
      { token: newRefreshToken },
      { upsert: true }
    );

    // 성공 응답
    console.log('로그인 성공:', user.userId);
    res.status(200).json({
      tokens: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
      user: {
        _id: user._id,
        username: user.username,
        userId: user.userId,
        userImage: user?.userImage,
        email: user.email,
        point: user.point,
      },
    });
  } catch (err) {
    console.error('서버 에러 발생:', err.message);
    res.status(500).json({ message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
};


const refreshToken = async (req, res) => {
  console.log('0');
    const { refresh_token } = req.body;
    if (!refresh_token) {
      console.log('리프레시 토큰',refresh_token);
      throw new BadRequestError("Refresh token is required");
    }
  
    try {
      const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(payload.userId);
  
      if (!user) {
        throw new UnauthenticatedError("Invalid refresh token");
      }
  
      const newAccessToken = user.createAccessToken();
      const newRefreshToken = user.createRefreshToken();
  
      res.status(StatusCodes.OK).json({
        tokens: { access_token: newAccessToken, refresh_token: newRefreshToken },
      });
    } catch (error) {
      console.error(error);
      throw new UnauthenticatedError("Invalid refresh token");
    }
  };

  const resetPassword = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 사용자를 이메일로 찾기
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
      }
  
      // 새로운 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 비밀번호 업데이트
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ ok: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, message: '비밀번호 변경에 실패하였습니다.' });
    }
  };

  module.exports = {
    register,
    login,
    refreshToken,
    resetPassword,
  };