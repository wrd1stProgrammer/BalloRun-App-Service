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

module.exports = async (app) => {
    const router = express.Router();

    // 기본 경로
    router.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    router.get('/health', (req, res) => {
        res.send('health check success');
    });

    app.use("/auth",authRouter);
    app.use("/user",authMiddleware,userRouter);
    app.use("/cafe",authMiddleware,cafeRouter);
    app.use("/order",authMiddleware,orderRouter);
    app.use("/rider",authMiddleware,riderRouter);
    app.use("/file",authMiddleware,fileRouter);
    app.use("/chat",authMiddleware,chatRouter);
    app.use("/neworder",authMiddleware,newOrderRouter);
    app.use("/address",authMiddleware,address);
    app.use("/notices",authMiddleware,noticeRouter);
    app.use("/payment",authMiddleware,paymentRouter);

    console.log('라우트 설정 OK');
};
