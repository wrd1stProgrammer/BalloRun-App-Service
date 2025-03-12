const jwt = require("jsonwebtoken");
const { UnauthenticatedError,NotFoundError } = require("../errors");
const User = require("../models/User");
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;

require('dotenv').config();

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  // console.log("Authorization Header:", authHeader); // 추가

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("No authorization header!");
    return res.status(401).json({ error: 'Authentication invalid' }); // 401 응답 반환
  }
  const token = authHeader.split(" ")[1];
  // console.log("Extracted Token:", token); // 추가
  //console.log(authHeader);
  //console.log(token);

  try {
    //console.log("Received token:", token); // 로그 추가
    const payload = jwt.verify(token, JWT_KEY);
    //console.log("Token payload:", payload); // 로그 추가
    // attach the user to the job routes
    // req.user = { userid: payload.userid, username: payload.username };

    // const user = await User.findById(payload.userid);
    //req.user = { userId: payload.userId };  // payload.id를 사용하여 req.user에 할당
    //console.log("req.user after setting:", req.user); // req.user 로그 추가

    
    const user = await User.findById(payload.userId);  // payload.id를 사용하여 사용자 조회
    //console.log("user found:", user); // user 로그 추가

    // isActive 체크: 비활성화된 계정 차단
    if (!user.isActive) {
      return res.status(401).json({ error: '계정이 비활성화되었습니다. 다시 가입해주세요.' });
    }

    // req.user에 userId와 전체 user 객체 할당
    //console.log(user,'미들웨어 로깅');
    req.user = {
      userId: payload.userId,
      user: user // user 객체 전체를 추가
    };  

    if (!user) {
      return res.status(401).json({ error: 'Authentication invalid' }); // 401 응답 반환
      //throw new NotFoundError("User not found");
    }
    next();
  } catch (error) {
    console.log("authorization error:", error); // 추가
    return res.status(401).json({ error: 'Authentication invalid' }); // 401 응답 반환
    // throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;