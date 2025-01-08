const jwt = require("jsonwebtoken");
const { UnauthenticatedError,NotFoundError } = require("../errors");
const User = require("../models/User");
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;

require('dotenv').config();

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader); // 추가

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("No authorization header!");
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // 추가
  //console.log(authHeader);
  //console.log(token);

  try {
    //console.log("Received token:", token); // 로그 추가
    const payload = jwt.verify(token, JWT_KEY);
    //console.log("Token payload:", payload); // 로그 추가
    // attach the user to the job routes
    // req.user = { userid: payload.userid, username: payload.username };

    // const user = await User.findById(payload.userid);
    req.user = { userId: payload.userId };  // payload.id를 사용하여 req.user에 할당
    //console.log("req.user after setting:", req.user); // req.user 로그 추가

    const user = await User.findById(payload.userId);  // payload.id를 사용하여 사용자 조회
    //console.log("user found:", user); // user 로그 추가


    if (!user) {
      throw new NotFoundError("User not found");
    }
    next();
  } catch (error) {
    console.log("authorization error:", error); // 추가
    // throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;