const User = require("../../models/User");
const Token = require("../../models/Token");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors");
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');

const checkNicknameApi = async (req, res) => {
    const { nickname } = req.body;
  
    // 닉네임이 제공되지 않았을 경우 에러 처리
    if (!nickname) {
      throw new BadRequestError("닉네임을 입력해주세요");
    }
  
    try {
      // User 모델에서 닉네임으로 조회
      const existingUser = await User.findOne({ nickname });
  
      // 닉네임이 이미 존재하면 false 반환
      if (existingUser) {
        return res.status(StatusCodes.OK).json({ available: false });
      }
  
      // 닉네임이 사용 가능하면 true 반환
      return res.status(StatusCodes.OK).json({ available: true });
    } catch (error) {
      // 데이터베이스 조회 중 오류 발생 시
      console.error("닉네임 조회 오류:", error);
      throw new BadRequestError("닉네임 확인 중 오류가 발생했습니다");
    }
  };
  
  const checkUserIdApi = async (req, res) => {
    const { userId } = req.body;
  
    // userId가 제공되지 않았을 경우 에러 처리
    if (!userId) {
      throw new BadRequestError("아이디를 입력해주세요");
    }
  
    try {
      // User 모델에서 userId로 조회 (필드명은 모델에 따라 다를 수 있음)
      const existingUser = await User.findOne({ userId });
  
      // userId가 이미 존재하면 false 반환
      if (existingUser) {
        return res.status(StatusCodes.OK).json({ available: false });
      }
  
      // userId가 사용 가능하면 true 반환
      return res.status(StatusCodes.OK).json({ available: true });
    } catch (error) {
      console.error("아이디 조회 오류:", error);
      throw new BadRequestError("아이디 확인 중 오류가 발생했습니다");
    }
  };
  
  const checkEmailApi = async (req, res) => {
    const { email } = req.body;
  
    // email이 제공되지 않았을 경우 에러 처리
    if (!email) {
      throw new BadRequestError("이메일을 입력해주세요");
    }
  
    try {
      // User 모델에서 email로 조회
      const existingUser = await User.findOne({ email });
  
      // email이 이미 존재하면 false 반환
      if (existingUser) {
        return res.status(StatusCodes.OK).json({ available: false });
      }
  
      // email이 사용 가능하면 true 반환
      return res.status(StatusCodes.OK).json({ available: true });
    } catch (error) {
      console.error("이메일 조회 오류:", error);
      throw new BadRequestError("이메일 확인 중 오류가 발생했습니다");
    }
  };
  
  module.exports = {
    checkNicknameApi,
    checkUserIdApi,
    checkEmailApi,
  };