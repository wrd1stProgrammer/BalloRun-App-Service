// media DB// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
}); // cloudinary key 변경 해야함. -> 새로 쓸 DB 파서

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // 업로드할 폴더 이름
    format: async (req, file) => 'mp4', // 형식 설정
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({ storage });

module.exports = parser;
module.exports = cloudinary;
