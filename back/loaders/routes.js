const express = require('express');
const authMiddleware = require("../middlewares/authentication");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
// const userRouter = require("../routes/user"); 예시

module.exports = async (app) => {
    const router = express.Router();

    // 기본 경로
    router.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    // 로그인 경로 -- 이하는 예시 코드
    // router.post('/login', authController.login);

    // // 회원가입 경로
    // router.post('/register', authController.register);
    
    // app.use("/file", authMiddleware,fileRouter);
    // app.use("/feed", authMiddleware, feedRouter);
    app.use("/auth",authMiddleware,authRouter);
    app.use("/user",authMiddleware,userRouter);

    console.log('라우트 OK');
};
