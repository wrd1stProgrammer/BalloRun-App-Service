import React, { useContext, useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AppBar from './etc/AppBar';
import { View, ScrollView } from 'react-native';
import DateDisplay from './etc/DateDisplay';
import ChatBubble from './ChatBubble';
import Input from './Input';
import { WebSocketContext } from '../../utils/Socket';
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
  const socket = useContext(WebSocketContext);
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

    const handleGetChatList = () => {
      socket.emit('chat-list', {
        token: access_token,
        chatRoomId: roomId,
      });
      socket.on('chat-list', (data) => {
        setChatData(data.data.chatList);
      });
    };

    handleGetChatList();

    return () => {
      socket.off('chat-list');
    };
  }, [socket]);

  const onPostMessageHandler = (message: string) => {
    if (!socket || !message) {
      return;
    }

    socket.emit('message', {
      token: access_token,
      chatRoomId: roomId,
      message,
    });
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
      <Input onPostMessageHandler={onPostMessageHandler} />
    </>
  );
};

export default ChatRoom;
