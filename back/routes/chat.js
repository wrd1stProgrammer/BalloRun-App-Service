const express = require("express");
const {
  deleteChatRoom
} = require("../controllers/chat/chatCRUD");

const router = express.Router();

router.patch('/leave/:chatRoomId',deleteChatRoom);

module.exports = router;