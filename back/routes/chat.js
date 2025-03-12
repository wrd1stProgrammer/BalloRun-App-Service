const express = require("express");
const {
  deleteChatRoom,
  checkChatRoomApi,
  toggleChatRoomAlarm,
} = require("../controllers/chat/chatCRUD");

const router = express.Router();

router.patch('/leave/:chatRoomId',deleteChatRoom);
router.get(`/checkchatroom/:roomId`,checkChatRoomApi);
router.patch(`/alarm/:id`,toggleChatRoomAlarm);
module.exports = router;