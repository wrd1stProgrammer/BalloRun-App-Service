const express = require('express');
const authMiddleware = require("../middlewares/authentication");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const cafeRouter = require("../routes/cafe");
const orderRouter = require("../routes/order");
const riderRouter = require("../routes/rider");
const fileRouter = require("../routes/file");
const chatRouter = require("../routes/chat");
const newOrderRouter = require("../routes/neworder");
const address = require("../routes/address");
const noticeRouter = require("../routes/notice");
const paymentRouter = require("../routes/payment");
const geminiRouter = require("../routes/gemini");


module.exports = async (app) => {
    const router = express.Router();

    // 기본 경로
    router.get('/', (req, res) => {
        res.send('안녕하세요 앱스토어,플레이스토어에 발로뛰어 검색 후 다운로드 부탁드립니다 !! ');
    });

    router.get('/health', (req, res) => {
        res.status(200).send('health check success');
      });
    
      // router 를 먼저 마운트 (헬스체크는 인증 없이 통과)
    app.use('/', router);

    app.use("/auth",authRouter);
    app.use("/user",authMiddleware,userRouter);
    app.use("/cafe",authMiddleware,cafeRouter);
    app.use("/order",authMiddleware,orderRouter);
    app.use("/rider",authMiddleware,riderRouter);
    app.use("/file",fileRouter);
    app.use("/chat",authMiddleware,chatRouter);
    app.use("/neworder",authMiddleware,newOrderRouter);
    app.use("/address",authMiddleware,address);
    app.use("/notices",authMiddleware,noticeRouter);
    app.use("/payment",authMiddleware,paymentRouter);

    app.use("/gemini",geminiRouter);

    console.log('라우트 설정 OK');
};
