const express = require("express");
const {
  deleteChatRoom,
  checkChatRoomApi,
} = require("../controllers/chat/chatCRUD");

const router = express.Router();

router.patch('/leave/:chatRoomId',deleteChatRoom);
router.get(`/checkchatroom/:roomId`,checkChatRoomApi);

module.exports = router;