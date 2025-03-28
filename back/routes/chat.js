const express = require("express");
const {
  deleteChatRoom,
  checkChatRoomApi,
  toggleChatRoomAlarm,
  reportChatApi,
} = require("../controllers/chat/chatCRUD");

const router = express.Router();

router.patch('/leave/:chatRoomId',deleteChatRoom);
router.get(`/checkchatroom/:roomId`,checkChatRoomApi);
router.patch(`/alarm/:id`,toggleChatRoomAlarm);
router.post(`/reportchat`,reportChatApi);
module.exports = router;