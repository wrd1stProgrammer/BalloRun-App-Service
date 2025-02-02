import React, { useContext, useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AppBar from './etc/AppBar';
import { View, ScrollView } from 'react-native';
import DateDisplay from './etc/DateDisplay';
import ChatBubble from './ChatBubble';
import Input from './Input';
import { ChatSocketContext } from '../../utils/ChatSocket';
import { token_storage } from '../../redux/config/storage';

export type ChatRoomScreenProps = StackScreenProps<
  RootStackParamList,
  'ChatRoom'
>;

type Message = {
  id: string;
  content: string;
  timestamp?: string;
  timeOfDay?: string;
  isMe?: boolean;
};

type ChatData = {
  [key: string]: Array<Message>;
};

const ChatRoom = ({ navigation, route }: ChatRoomScreenProps) => {
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const { roomId } = route.params;
  const [chatData, setChatData] = useState<ChatData>({});

  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  useEffect(() => {
    if (!socket) return;
  
    const handleGetChatMessages = () => {
      //  기존 채팅 목록 가져오기
      socket.emit("chat-list", { token: access_token, chatRoomId: roomId });
      socket.on("chat-list", (data) => {
        setChatData(data.data.chatList);
      });
  
      //  새로운 메시지를 받을 때 UI 업데이트
      socket.on("chatMessage", (newMessage) => {
        setChatData((prevChatData) => {
          const updatedChatData = { ...prevChatData };
  
          // 메시지의 날짜별로 정리
          const messageDate = new Date(newMessage.createdAt).toDateString();
  
          if (!updatedChatData[messageDate]) {
            updatedChatData[messageDate] = [];
          }
  
          updatedChatData[messageDate].push({
            id: newMessage.id,
            content: newMessage.content,
            timestamp: newMessage.createdAt,
            isMe: newMessage.sender === access_token, // 내가 보낸 메시지인지 확인
          });
  
          return updatedChatData;
        });
  
        scrollToBottom(); // 새로운 메시지가 오면 자동 스크롤
      });
    };
  
    handleGetChatMessages();
  
    return () => {
      socket.off("chat-list");
      socket.off("chatMessage"); // 이벤트 리스너 제거
    };
  }, [socket,roomId]);
  

  const onPostMessageHandler = (message: string) => {
    if (!socket || !message) return;
  
    // 1. 클라이언트에서 먼저 UI 업데이트 (즉시 반영)
    setChatData((prevChatData) => {
      const updatedChatData = { ...prevChatData };
      const currentDate = new Date().toDateString();
  
      if (!updatedChatData[currentDate]) {
        updatedChatData[currentDate] = [];
      }
  
      const tempMessage = {
        id: Date.now().toString(), // 임시 ID (서버에서 업데이트될 예정)
        content: message,
        timestamp: new Date().toISOString(),
        isMe: true, // 내가 보낸 메시지
      };
  
      updatedChatData[currentDate].push(tempMessage);
      return updatedChatData;
    });
  
    scrollToBottom(); // 바로 스크롤 이동

    
  };
  

  return (
    <>
      <AppBar />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
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
                  isSentByMe={!!messageChild.isMe}
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
    </>
  );
};

export default ChatRoom;
