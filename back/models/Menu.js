const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  cafeName: { type: String, required: true },
  menuName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },  // Cloudinary URL 저장
  // 필요 시, category, rating, etc...
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema,'menus');
