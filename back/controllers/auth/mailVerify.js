const nodemailer = require('nodemailer');
const User = require("../../models/User");

// Nodemailer 
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY,
    },
});

const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// 이메일 전송 
const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // 📌이메일 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        }

        //  6자리 인증 코드 생성
        const verificationCode = generateRandomCode();

        //  이메일 전송
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "캠퍼스커피 이메일 인증 코드",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>이메일 인증 코드</h2>
                    <p>아래의 6자리 인증 코드를 입력해 주세요.</p>
                    <h1 style="color: #2D89EF;">${verificationCode}</h1>
                    <p>이 코드는 5분 동안 유효합니다.</p>
                </div>
            `,
        });

        console.log(`이메일 전송 성공: ${email}, 인증 코드: ${verificationCode}`);
        return res.status(200).json({ message: "이메일 전송 성공", verificationCode });

    } catch (error) {
        console.error("이메일 전송 오류:", error);
        return res.status(500).json({ message: "이메일 전송 실패", error });
    }
};

module.exports = {
    sendEmail
};
