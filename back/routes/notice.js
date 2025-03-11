const express = require("express");
const {
    createNotice,
    getNotices,
} = require("../controllers/profile/noticeController");

const router = express.Router();

router.get('/readnotices',getNotices);
router.post('/writenotices',createNotice);

module.exports = router;