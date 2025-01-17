const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    cafeName: { type: String, required: true }, // 카페 이름
    menuName: { type: String, required: true }, // 메뉴 이름
    price: { type: Number, required: true }, // 가격
    description: { type: String }, // 설명 (선택 사항)
    imageUrl: { type: String }, // Cloudinary URL
    RequiredOption: { type: String, required: true }, // 필수 옵션
    AdditionalOptions: { type: [String], required: false }, // 추가 옵션 배열
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', menuSchema, 'menus');
