const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");
const {sendPushNotification} = require("../utils/sendPushNotification");


module.exports = (chatIo) => {
  if (!chatIo) {
    console.error("Chat Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }

  //  채팅 소켓 연결 미들웨어 (토큰 인증)
  chatIo.use(async (socket, next) => {
    console.log("[ChatSocket] Middleware 실행 중...");
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("토큰이 없습니다."));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;
      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error("유효하지 않은 사용자입니다."));
      }
      next();
    } catch (err) {
      return next(new Error("토큰 검증 실패: " + err.message));
    }
  });

  // 채팅 연결 및 이벤트 설정
  chatIo.on("connection", (socket) => {
    console.log(`[ChatSocket] User ${socket.user.userId} connected`);

  // 채팅방 유저가 들어갈 시 조인 소켓.
  socket.on("joinRoom", async ({ roomId }) => {
    socket.join(roomId);
    console.log(`[ChatSocket] User ${socket.user.userId} joined room ${roomId}`);

    // 모든 안 읽은 메시지를 읽음 처리
    await ChatMessage.updateMany(
      { chatRoomId: roomId, readBy: { $ne: socket.user.userId } },
      { $addToSet: { readBy: socket.user.userId } }
  );

  // 채팅방 목록 갱신 트리거 (선택적)
  //socket.emit("room-list-update", { roomId });
});

  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`[ChatSocket] User ${socket.user.userId} left room ${roomId}`);
  });

  socket.on("room-list", async ({ token }) => {
    try {
      console.log("room-list server log");
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.userId;
  
      // MongoDB에서 사용자의 채팅방 목록 조회
      const chatRooms = await ChatRoom.find({
        $or: [
          { participants: new mongoose.Types.ObjectId(userId) },
          { users: new mongoose.Types.ObjectId(userId) },
        ],
      });
  
      // 채팅방 목록 가공
      const chatRoomList = await Promise.all(
        chatRooms.map(async (room) => {
          // 1. users 배열에서 userId와 비교하여 다른 사용자의 아이디 찾기
          const otherUserId = room.users.find(
            (user) => user.toString() !== userId
          );
  
          // 2. 다른 사용자의 userImage 조회
          let userImage = "";
          if (otherUserId) {
            const otherUser = await User.findById(otherUserId);
            userImage = otherUser?.userImage || "";
            username = otherUser?.username;
            nickname = otherUser?.nickname;
          }
          
          // 안 읽은 메시지 수 계산
        const unreadCount = await ChatMessage.countDocuments({
          chatRoomId: room._id,
          readBy: { $ne: userId }, // userId가 readBy에 없는 메시지
        });
  
          // 기존 반환 데이터 구조 유지
          return {
            id: room._id.toString(),
            title: room.title,
            lastChat: room.lastMessage || "대화 없음",
            lastChatAt: room.updatedAt,
            isAlarm: room.isAlarm || false,
            userImage, // 조회한 userImage 사용
            username,
            nickname,
            unreadCount, // 안 읽은 메세지 개수 (상대가 보낸.)
          };
        })
      );
  
      socket.emit("room-list", { data: { chatRoomList } });
    } catch (error) {
      console.error("[ChatSocket] room-list 조회 실패:", error);
      socket.emit("error", { message: "채팅방 목록을 가져오는 중 오류 발생" });
    }
  });

    // 특정 채팅방의 메시지 불러오기 (`chat-list`)
    socket.on("chat-list", async ({ token, chatRoomId }) => {
        try {
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const userId = decodedToken.userId;
  
          const chatMessages = await ChatMessage.find({ chatRoomId }).sort("createdAt");

          // 날짜별로 그룹화
          const groupedMessages = chatMessages.reduce((acc, msg) => {
            const date = new Date(msg.createdAt).toDateString(); // 날짜 키 생성 (예: "Sat Jul 06 2024")
            
            if (!acc[date]) {
              acc[date] = [];
            }
            
            acc[date].push({
              id: msg._id.toString(),
              content: msg.content,
              timestamp: msg.createdAt,
              imageUrl: msg.imageUrl, // 이미지 URL 추가
              isMe: msg.sender.toString() === userId,
            });
            
            return acc;
          }, {}); // 초기값은 빈 객체
  
          socket.emit("chat-list", { 
            data: { 
              chatList: groupedMessages // 그룹화된 객체 전송
            } 
          });      
        } catch (error) {
          console.error("[ChatSocket] chat-list 조회 실패:", error);
          socket.emit("error", { message: "채팅 내역을 가져오는 중 오류 발생" });
        }
      });

    //  메시지 전송 처리 (`sendMessage` 이벤트)
    socket.on("sendMessage", async ({ chatRoomId, message }) => {
        try {
          const userId = socket.user.userId;
          
          const user = await User.findById(userId);
          console.log('socket',user);
  
          // 1. 채팅 메시지 저장
          const newMessage = new ChatMessage({
            chatRoomId,
            sender: userId,
            content: message,
            readBy: [userId], // 보낸 사람은 기본적으로 읽음
          });
  
          await newMessage.save();
  
          //  2. 채팅방의 마지막 메시지 업데이트
          await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: message,
            lastMessageAt: new Date(),
          });

      // 실시간으로 방에 있는 사용자 확인 -> 테스트 필요함.
      /*
    const roomUsers = chatIo.sockets.adapter.rooms.get(chatRoomId);
    if (roomUsers) {
      const participants = Array.from(roomUsers).map((socketId) => {
        return chatIo.sockets.sockets.get(socketId)?.user?.userId;
      });
      // 방에 있는 모든 사용자를 읽음 처리
      await ChatMessage.updateOne(
        { _id: newMessage._id },
        { $addToSet: { readBy: { $each: participants } } }
      );
    }*/
  
          //  3. 해당 채팅방의 모든 사용자에게 메시지 전송
          // 1.실시간 x 
          chatIo.to(chatRoomId).emit("chatMessage", {
            id: newMessage._id.toString(),
            sender: userId,
            content: message,
            createdAt: newMessage.createdAt,
            readBy: newMessage.readBy,
          });

            // 푸쉬 알림 -> 배달매칭ㅇㅋ, 채팅 ㅇㅋ 
            const notipayload ={
              title: `메세지가 도착하였습니다.`,
              body: `${message}`,
              data: {type:"chat", orderId:chatRoomId},
            }
            if (user.fcmToken) {
              //await sendPushNotification(user.fcmToken, notipayload); //임시로 나애게 보내
              console.log('ios APNs 설정 안되서 일단 주석');
            } else {
              console.log(`사용자의 FCM 토큰이 없습니다.`);
            }
  
          console.log(`[ChatSocket] Message sent in Room ${chatRoomId}: ${message}`);
        } catch (error) {
          console.error("[ChatSocket] sendMessage Error:", error);
        }
    });

    socket.on("sendImageMessage", async ({ chatRoomId, imageUrl }) => {
      try {
        const userId = socket.user.userId;
    
        // 1. 사용자 정보 조회
        const user = await User.findById(userId);
        console.log('socket', user);
    
        // 2. 채팅 메시지 저장 (이미지 URL 포함)
        const newMessage = new ChatMessage({
          chatRoomId,
          sender: userId,
          imageUrl, // 이미지 URL 저장
          content: "", // 텍스트 메시지는 없음
        });
    
        await newMessage.save();
    
        // 3. 채팅방의 마지막 메시지 업데이트 (이미지 메시지임을 표시)
        await ChatRoom.findByIdAndUpdate(chatRoomId, {
          lastMessage: "사진을 보냈습니다.", // 마지막 메시지 내용
          lastMessageAt: new Date(),
        });
    
        // 4. 해당 채팅방의 모든 사용자에게 이미지 메시지 전송
        chatIo.to(chatRoomId).emit("chatMessage", {
          id: newMessage._id.toString(),
          sender: userId,
          imageUrl, // 이미지 URL 전송
          createdAt: newMessage.createdAt,
        });
    
        // 5. 푸시 알림 (이미지 메시지임을 표시)
        const notipayload = {
          title: `사진이 도착하였습니다.`,
          body: `사진을 보냈습니다.`,
          data: { type: "chat", orderId: chatRoomId },
        };
    
        if (user.fcmToken) {
          // await sendPushNotification(user.fcmToken, notipayload); // 임시로 나에게 보내
          console.log('ios APNs 설정 안되서 일단 주석');
        } else {
          console.log(`사용자의 FCM 토큰이 없습니다.`);
        }
    
        console.log(`[ChatSocket] Image Message sent in Room ${chatRoomId}: ${imageUrl}`);
      } catch (error) {
        console.error("[ChatSocket] sendImageMessage Error:", error);
      }
    });
  


    socket.on("disconnect", () => {
      console.log(`[ChatSocket] User ${socket.user.userId} disconnected`);
    });
  });
};

