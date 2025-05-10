//upload 로직용

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });
//test

module.exports = upload;