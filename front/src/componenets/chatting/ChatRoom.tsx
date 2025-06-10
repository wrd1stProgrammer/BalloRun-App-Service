import React, { useContext, useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AppBar from './etc/AppBar';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import DateDisplay from './etc/DateDisplay';
import ChatBubble from './ChatBubble';
import Input from './Input';
import { ChatSocketContext } from '../../utils/sockets/ChatSocket';
import { token_storage } from '../../redux/config/storage';
import { useAppSelector } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { updateLastChat } from '../../redux/reducers/chatSlice';
import { useAppDispatch } from '../../redux/config/reduxHook';

// 👉 추가
import ImageViewing from 'react-native-image-viewing';

export type ChatRoomScreenProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

type Message = {
  id: string;
  content: string;
  timestamp?: string;
  timeOfDay?: string;
  isMe?: boolean;
  imageUrl?: string;
  isLoading: boolean;
};

type ChatData = {
  [key: string]: Array<Message>;
};

const ChatRoom = ({ navigation, route }: ChatRoomScreenProps) => {
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const { roomId, username, nickname, userImage } = route.params;
  const [chatData, setChatData] = useState<ChatData>({});
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 👉 이미지 뷰어 상태 관리
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState<{uri: string}[]>([]);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { roomId });

    const handleGetChatMessages = () => {
      socket.emit('chat-list', { token: access_token, chatRoomId: roomId });
      socket.on('chat-list', (data) => {
        setChatData(data.data.chatList);
      });

      socket.on('chatMessage', (newMessage) => {
        setChatData((prevChatData) => {
          const messageDate = new Date(newMessage.createdAt).toDateString();
          const tempIdPrefix = 'temp_';
          const updatedChatData = { ...prevChatData };
          const currentMessages = updatedChatData[messageDate] ? [...updatedChatData[messageDate]] : [];

          const tempMessageIndex = currentMessages.findIndex((msg) => msg.id.startsWith(tempIdPrefix));
          if (tempMessageIndex !== -1) currentMessages.splice(tempMessageIndex, 1);

          currentMessages.push({
            id: newMessage.id,
            content: newMessage.content,
            imageUrl: newMessage.imageUrl,
            timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: newMessage.sender === user?._id,
            isLoading: false,
          });

          dispatch(
            updateLastChat({
              roomId,
              lastChat: newMessage.content || '사진을 보냈습니다.',
              lastChatAt: newMessage.createdAt,
              unreadCount: 0,
            })
          );

          return { ...updatedChatData, [messageDate]: currentMessages };
        });
        scrollToBottom();
      });
    };

    handleGetChatMessages();

    return () => {
      socket.emit('leaveRoom', { roomId });
      socket.off('chat-list');
      socket.off('chatMessage');
    };
  }, [socket, roomId]);

  const onPostMessageHandler = (message: string, imageUrl?: string, isLoading: boolean = false, tempId?: string) => {
    if (!socket || (!message && !imageUrl)) return;

    const newTempId = tempId || `temp_${Date.now()}`;

    setChatData((prevChatData) => {
      const currentDate = new Date().toDateString();
      const currentMessages = prevChatData[currentDate] ? [...prevChatData[currentDate]] : [];

      const existingMessageIndex = currentMessages.findIndex((msg) => msg.id === newTempId);
      if (existingMessageIndex !== -1) {
        currentMessages[existingMessageIndex] = {
          ...currentMessages[existingMessageIndex],
          imageUrl: imageUrl || currentMessages[existingMessageIndex].imageUrl,
          isLoading: isLoading,
        };
      } else {
        currentMessages.push({
          id: newTempId,
          content: message,
          imageUrl: imageUrl || undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          isLoading: isLoading,
        });
      }

      return {
        ...prevChatData,
        [currentDate]: currentMessages,
      };
    });

    scrollToBottom();
  };

  // 👉 이미지 터치 시 핸들러
  const onImagePress = (imageUrl: string) => {
    // 모든 날짜를 합쳐서 이미지 메시지들만 추출
    const images: {uri: string}[] = [];
    let foundIndex = 0;
    let count = 0;

    Object.values(chatData).forEach((messages) => {
      messages.forEach((msg) => {
        if (msg.imageUrl) {
          if (msg.imageUrl === imageUrl) foundIndex = count;
          images.push({ uri: msg.imageUrl });
          count++;
        }
      });
    });

    setImageViewerImages(images);
    setImageViewerIndex(foundIndex);
    setImageViewerVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <AppBar onBackPress={() => navigation.goBack()} username={username} nickname={nickname} roomId={roomId} />
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(chatData).map(([date, children], i) => {
            const contents = children.map((child, index) => {
              const messageChild = child;

              return (
                <React.Fragment key={messageChild.id + index + 'Fragment'}>
                  <ChatBubble
                    key={messageChild.id}
                    message={messageChild.content}
                    imageUrl={messageChild.imageUrl}
                    isSentByMe={!!messageChild.isMe}
                    isLoading={messageChild.isLoading}
                    userImage={userImage}
                    {...(!!messageChild.timeOfDay &&
                      !!messageChild.timestamp && {
                        timeStamp: `${messageChild.timeOfDay} ${messageChild.timestamp}`,
                      })}
                    // 👉 이미지 터치 핸들러 전달
                    onImagePress={messageChild.imageUrl ? () => onImagePress(messageChild.imageUrl!) : undefined}
                  />
                  <View style={{ paddingBottom: 4 }} key={messageChild.id + index} />
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
      {/* 👉 이미지 뷰어 */}
      <ImageViewing
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        // (필요 시 Header/Footer 등도 커스터마이즈 가능)
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
});

export default ChatRoom;
