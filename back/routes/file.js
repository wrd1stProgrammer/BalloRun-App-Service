const express = require("express");
const { uploadMedia } = require("../controllers/file/upload");
const upload = require("../config/multer");
const router = express.Router();


router.post("/orderupload", upload.single("image"), uploadMedia);

module.exports = router;