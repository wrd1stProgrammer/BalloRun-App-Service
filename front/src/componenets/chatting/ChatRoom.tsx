import React, { useContext, useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AppBar from './etc/AppBar';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import DateDisplay from './etc/DateDisplay';
import ChatBubble from './ChatBubble';
import Input from './Input';
import { ChatSocketContext } from '../../utils/sockets/ChatSocket';
import { token_storage } from '../../redux/config/storage';
import { useAppSelector } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';

export type ChatRoomScreenProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

type Message = {
  id: string;
  content: string;
  timestamp?: string;
  timeOfDay?: string;
  isMe?: boolean;
  imageUrl?: string; // 이미지 URL 추가
  isLoading:boolean;
};

type ChatData = {
  [key: string]: Array<Message>;
};

const ChatRoom = ({ navigation, route }: ChatRoomScreenProps) => {
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const { roomId } = route.params;
  const [chatData, setChatData] = useState<ChatData>({});
  const user = useAppSelector(selectUser);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100); // 약간의 딜레이 추가
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { roomId }); // 방 조인

    const handleGetChatMessages = () => {
      // 기존 채팅 목록 가져오기
      socket.emit("chat-list", { token: access_token, chatRoomId: roomId });
      socket.on("chat-list", (data) => {
        setChatData(data.data.chatList);
      });
      console.log('cache test');

      // 새로운 메시지를 받을 때 UI 업데이트
      socket.on("chatMessage", (newMessage) => {
        setChatData((prevChatData) => {
          const messageDate = new Date(newMessage.createdAt).toDateString();
          const tempIdPrefix = 'temp_'; // 임시 ID 식별용 접두사

          // 불변성 유지를 위한 복제
          const updatedChatData = { ...prevChatData };

          // 해당 날짜의 메시지 배열 복제 (없으면 생성)
          const currentMessages = updatedChatData[messageDate] ? [...updatedChatData[messageDate]] : [];

          // 임시 메시지 찾기 (접두사로 검색)
          const tempMessageIndex = currentMessages.findIndex(
            msg => msg.id.startsWith(tempIdPrefix)
          );

          // 임시 메시지가 있으면 제거
          if (tempMessageIndex !== -1) {
            currentMessages.splice(tempMessageIndex, 1);
          }

          // 실제 메시지 추가
          currentMessages.push({
            id: newMessage.id,
            content: newMessage.content,
            imageUrl: newMessage.imageUrl, // 이미지 URL 추가
            timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: newMessage.sender === user?._id,
            isLoading: false, // 서버 응답이 왔으므로 로딩 종료
          });

          // 업데이트된 객체 반환
          return {
            ...updatedChatData,
            [messageDate]: currentMessages
          };
        });

        scrollToBottom();
      });
    };

    handleGetChatMessages();

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("chat-list");
      socket.off("chatMessage"); // 이벤트 리스너 제거
    };
  }, [socket, roomId]);

  const onPostMessageHandler = (message: string, imageUrl?: string, isLoading: boolean = false, tempId?: string) => {
    if (!socket || (!message && !imageUrl)) return;

    // 임시 ID 생성 (접두사 추가)
    const newTempId = tempId || `temp_${Date.now()}`;

    setChatData((prevChatData) => {
      const currentDate = new Date().toDateString();
      const currentMessages = prevChatData[currentDate] ? [...prevChatData[currentDate]] : [];

      // 임시 메시지가 이미 있는 경우 업데이트
      const existingMessageIndex = currentMessages.findIndex(msg => msg.id === newTempId);
      if (existingMessageIndex !== -1) {
        currentMessages[existingMessageIndex] = {
          ...currentMessages[existingMessageIndex],
          imageUrl: imageUrl || currentMessages[existingMessageIndex].imageUrl,
          isLoading: isLoading,
        };
      } else {
        // 새로운 메시지 추가
        currentMessages.push({
          id: newTempId,
          content: message,
          imageUrl: imageUrl || undefined, // 이미지가 있으면 추가
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          isLoading: isLoading, // 로딩 상태 추가
        });
      }

      return {
        ...prevChatData,
        [currentDate]: currentMessages
      };
    });

    scrollToBottom();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
      >
        {Object.entries(chatData).map(([date, children], i) => {
          const contents = children.map((child, index) => {
            const messageChild = child;

            return (
              <React.Fragment key={messageChild.id + index + 'Fragment'}>
                <ChatBubble
                  key={messageChild.id}
                  message={messageChild.content}
                  imageUrl={messageChild.imageUrl} // 이미지 URL 전달
                  isSentByMe={!!messageChild.isMe}
                  isLoading={messageChild.isLoading} // 로딩 상태 전달
                  {...(!!messageChild.timeOfDay &&
                    !!messageChild.timestamp && {
                      timeStamp: `${messageChild.timeOfDay} ${messageChild.timestamp}`,
                    })}
                />
                <View
                  style={{ paddingBottom: 4 }}
                  key={messageChild.id + index}
                />
              </React.Fragment>
            );
          });
          return (
            <React.Fragment key={date + i + 'Fragment'}>
              <View style={{ paddingTop: 16 }} key={date + i + 'up'} />
              <DateDisplay key={date} timestamp={date} />
              <View style={{ paddingBottom: 16 }} key={date + i + 'down'} />
              {contents}
            </React.Fragment>
          );
        })}
      </ScrollView>
      <Input chatRoomId={roomId} onPostMessageHandler={onPostMessageHandler} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default ChatRoom;