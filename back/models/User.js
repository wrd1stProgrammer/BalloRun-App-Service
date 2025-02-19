const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    username: {
      type: String,
      required: true,
      match: [/^[a-zA-Z0-9_]{3,30}$/, "Please provide a valid username"],
      unique: true,
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
    }
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

const User = mongoose.model("User", UserSchema);
module.exports = User;
