const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');
const { sendPushNotification } = require('../utils/sendPushNotification');

module.exports = (chatIo) => {
  if (!chatIo) {
    console.error('Chat Socket.IO 객체가 전달되지 않았습니다.');
    return;
  }

  // 채팅 소켓 연결 미들웨어 (토큰 인증)
  chatIo.use(async (socket, next) => {
    console.log('[ChatSocket] Middleware 실행 중...');
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('토큰이 없습니다.'));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;
      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error('유효하지 않은 사용자입니다.'));
      }
      next();
    } catch (err) {
      return next(new Error('토큰 검증 실패: ' + err.message));
    }
  });

  // 채팅 연결 및 이벤트 설정
  chatIo.on('connection', (socket) => {
    console.log(`[ChatSocket] User ${socket.user.userId} connected`);
    socket.join(`user_${socket.user.userId}`); // 개인 방 가입

    // 채팅방 유저가 들어갈 시 조인 소켓
    socket.on('joinRoom', async ({ roomId }) => {
      socket.join(roomId);
      console.log(`[ChatSocket] User ${socket.user.userId} joined room ${roomId}`);

      // 모든 메시지 읽음 처리
      await ChatMessage.updateMany(
        { chatRoomId: roomId, readBy: { $ne: socket.user.userId } },
        { $addToSet: { readBy: socket.user.userId } }
      );

      // 채팅방 정보 가져오기
      const chatRoom = await ChatRoom.findById(roomId);
      socket.emit('room-updated', {
        roomId,
        lastMessage: chatRoom.lastMessage,
        lastMessageAt: chatRoom.lastMessageAt,
        unreadCount: 0, // 읽음 처리했으므로 0
      });
    });

    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      console.log(`[ChatSocket] User ${socket.user.userId} left room ${roomId}`);
    });

    socket.on('room-list', async ({ token }) => {
      try {
        console.log('room-list server log');
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
            let userImage = '';
            let username = '';
            let nickname = '';
            if (otherUserId) {
              const otherUser = await User.findById(otherUserId);
              userImage = otherUser?.userImage || '';
              username = otherUser?.username;
              nickname = otherUser?.nickname;
            }

            // 안 읽은 메시지 수 계산
            const unreadCount = await ChatMessage.countDocuments({
              chatRoomId: room._id,
              readBy: { $ne: userId },
            }).catch((err) => {
              console.log(`[ChatSocket] unreadCount 계산 실패 for room ${room._id}:`, err);
              return 0; // 에러 시 기본값 0
            });

            // 사용자별 알림 설정 조회
            const userAlarmSetting = room.usersAlarm.find(
              (alarm) => alarm.userId.toString() === userId
            );

            // 기존 반환 데이터 구조 유지
            return {
              id: room._id.toString(),
              title: room.title,
              lastChat: room.lastMessage || '대화 없음',
              lastChatAt: room.updatedAt,
              isAlarm: userAlarmSetting ? userAlarmSetting.isAlarm : false, // 사용자별 알림 설정
              userImage,
              username,
              nickname,
              unreadCount,
            };
          })
        );

        socket.emit('room-list', { data: { chatRoomList } });
      } catch (error) {
        console.error('[ChatSocket] room-list 조회 실패:', error);
        socket.emit('error', { message: '채팅방 목록을 가져오는 중 오류 발생' });
      }
    });

    // 특정 채팅방의 메시지 불러오기 (`chat-list`)
    socket.on('chat-list', async ({ token, chatRoomId }) => {
      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;

        const chatMessages = await ChatMessage.find({ chatRoomId }).sort('createdAt');

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

        socket.emit('chat-list', {
          data: {
            chatList: groupedMessages, // 그룹화된 객체 전송
          },
        });
      } catch (error) {
        console.error('[ChatSocket] chat-list 조회 실패:', error);
        socket.emit('error', { message: '채팅 내역을 가져오는 중 오류 발생' });
      }
    });

    // 메시지 전송 처리 (`sendMessage` 이벤트)
    socket.on('sendMessage', async ({ chatRoomId, message }) => {
      try {
        const userId = socket.user.userId;

        const user = await User.findById(userId);
        console.log('socket', user);

        // 1. 채팅 메시지 저장
        const newMessage = new ChatMessage({
          chatRoomId,
          sender: userId,
          content: message,
          readBy: [userId], // 보낸 사람은 기본적으로 읽음
        });

        await newMessage.save();

        // 2. 챗룸 저장
        const chatRoom = await ChatRoom.findByIdAndUpdate(
          chatRoomId,
          { lastMessage: message, lastMessageAt: new Date() },
          { new: true }
        ).populate('users');

        // 3. 상대방 찾기 (1대1이므로 users 배열에서 sender가 아닌 사용자)
        const otherUserId = chatRoom.users.find((u) => u._id.toString() !== userId)._id.toString();

        // 4. 상대방 정보 조회 (username, userImage, nickname)
        const otherUser = await User.findById(otherUserId).select('username userImage nickname fcmToken').lean();
        if (!otherUser) {
          console.log(`User with ID ${otherUserId} not found`);
        } else {
          console.log('Other User Info:', {
            username: otherUser.username,
            userImage: otherUser.userImage,
            nickname: otherUser.nickname,
          });
        }

        // 5. 해당 채팅방의 모든 사용자에게 메시지 전송
        chatIo.to(chatRoomId).emit('chatMessage', {
          id: newMessage._id.toString(),
          sender: userId,
          content: message,
          createdAt: newMessage.createdAt,
          readBy: newMessage.readBy,
        });

        // 6. 상대방에게만 채팅방 업데이트 알림
        const unreadCount = await ChatMessage.countDocuments({
          chatRoomId,
          readBy: { $ne: otherUserId },
        });
        chatIo.to(`user_${otherUserId}`).emit('room-updated', {
          roomId: chatRoomId,
          lastMessage: message,
          lastMessageAt: newMessage.createdAt,
          unreadCount,
        });

        // 7. 푸시 알림 (상대방 알림 설정 확인)
        const otherUserAlarmSetting = chatRoom.usersAlarm.find(
          (alarm) => alarm.userId.toString() === otherUserId
        );
        const shouldSendNotification = otherUserAlarmSetting ? otherUserAlarmSetting.isAlarm : false;

        if (shouldSendNotification && otherUser.fcmToken) {
          const notipayload = {
            title: `메세지가 도착하였습니다.`,
            body: `${message}`,
            data: { type: 'chat', orderId: chatRoomId },
          };
          // await sendPushNotification(otherUser.fcmToken, notipayload);
          console.log('ios APNs 설정 안되서 일단 주석');
        } else {
          console.log(
            shouldSendNotification
              ? `상대방의 FCM 토큰이 없습니다.`
              : `상대방이 알림을 꺼놓았습니다.`
          );
        }

        console.log(`[ChatSocket] Message sent in Room ${chatRoomId}: ${message}`);
      } catch (error) {
        console.error('[ChatSocket] sendMessage Error:', error);
      }
    });

    // 이미지 메시지 전송 처리 (`sendImageMessage` 이벤트)
    socket.on('sendImageMessage', async ({ chatRoomId, imageUrl }) => {
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
          content: '', // 텍스트 메시지는 없음
        });

        await newMessage.save();

        // 3. 채팅방 업데이트
        const chatRoom = await ChatRoom.findByIdAndUpdate(
          chatRoomId,
          { lastMessage: '사진을 보냈습니다.', lastMessageAt: new Date() },
          { new: true }
        ).populate('users');

        // 4. 상대방 찾기
        const otherUserId = chatRoom.users.find((u) => u._id.toString() !== userId)._id.toString();

        // 5. 해당 채팅방의 모든 사용자에게 이미지 메시지 전송
        chatIo.to(chatRoomId).emit('chatMessage', {
          id: newMessage._id.toString(),
          sender: userId,
          imageUrl, // 이미지 URL 전송
          createdAt: newMessage.createdAt,
        });

        // 6. 상대방에게 채팅방 업데이트 알림
        const unreadCount = await ChatMessage.countDocuments({
          chatRoomId,
          readBy: { $ne: otherUserId },
        });
        chatIo.to(`user_${otherUserId}`).emit('room-updated', {
          roomId: chatRoomId,
          lastMessage: '사진을 보냈습니다.',
          lastMessageAt: newMessage.createdAt,
          unreadCount,
        });

        // 7. 푸시 알림 (상대방 알림 설정 확인)
        const otherUser = await User.findById(otherUserId).select('fcmToken').lean();
        const otherUserAlarmSetting = chatRoom.usersAlarm.find(
          (alarm) => alarm.userId.toString() === otherUserId
        );
        const shouldSendNotification = otherUserAlarmSetting ? otherUserAlarmSetting.isAlarm : false;

        if (shouldSendNotification && otherUser.fcmToken) {
          const notipayload = {
            title: `사진이 도착하였습니다.`,
            body: `사진을 보냈습니다.`,
            data: { type: 'chat', orderId: chatRoomId },
          };
          // await sendPushNotification(otherUser.fcmToken, notipayload);
          console.log('ios APNs 설정 안되서 일단 주석');
        } else {
          console.log(
            shouldSendNotification
              ? `상대방의 FCM 토큰이 없습니다.`
              : `상대방이 알림을 꺼놓았습니다.`
          );
        }

        console.log(`[ChatSocket] Image Message sent in Room ${chatRoomId}: ${imageUrl}`);
      } catch (error) {
        console.error('[ChatSocket] sendImageMessage Error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[ChatSocket] User ${socket.user.userId} disconnected`);
    });
  });
};