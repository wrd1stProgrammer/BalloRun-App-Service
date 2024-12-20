const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  userId: { type: String, required: true ,unique: true},
  password: { type: String, required: true },
  username:{type:String,required:true,unique:true}, 
  userImage: {type:String}, //프로필 이미지 로직 추가 해야함
  authStatus: { type: Number, default: 0 },
},{ timestamps: true } // 생성 및 수정 시각 자동 기록
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
