const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    admin:{ // 관리자 작업 하기 위해 따로 생성.
      type:String,
      default:false,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    username: { // real name
      type: String,
      required: true,
      //match: [/^[a-zA-Z0-9_]{3,30}$/, "Please provide a valid username"],
      unique: true,
    },
      nickname: {
        type:String,
        required:false,
        unique:true,
      },

    userId: {
      type: String,
      maxlength: 50,
      minlength: 5,
      unique: true, // kakao 면 이메일 앞을 따서 저장하자
    },
    password: {
       type: String,
       required: false, // kakao 에선 password가 없으니
    },
    userImage: {
      type: String, // 나중에 추가,
    },
    point:{
      type: Number,
      default:0,
    },
    address: {  // ✅ 기본 주소 추가
      type: String,
      default: "",
  },
   phone:{
      type: Number,
      required:false,
   },
    fcmToken:{
      type:String,
      required: false, 
    },
    loginProvider:{
      type:String,
      required: false,
    },
    isDelivering:{
      type: Boolean,
      default:false,
    },
    isRider:{
      type:Boolean,
      default:false,
    },
    verificationStatus: { // 선택적 추가
      type: String,
      enum: ['pending', 'verified', 'rejected', 'notSubmitted'],
      default: 'notSubmitted',
    },
    account: {
      bankName: String,
      accountNumber: String,
      holder: String,
    },
    // 레벨과 경험치 
    level: {
      type: Number,
      default: 1, // 기본 레벨 1
      min: 1,
      max: 3, // 최대 레벨 3
    },
    exp: {
      type: Number,
      default: 0, // 기본 경험치 0
      min: 0,
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.methods.createAccessToken = function () {
    return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  
  UserSchema.methods.createRefreshToken = function () {
    return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  };

  //레벨업 로직은 수정하자..
UserSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('exp')) { 
    if (user.exp >= 400 && user.level < 3) {
      user.level = 3;
    } else if (user.exp >= 100 && user.level < 2) {
      user.level = 2;
    }
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
