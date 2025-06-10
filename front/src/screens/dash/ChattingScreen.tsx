import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import TYPOS from '../../componenets/chatting/etc/TYPOS';
import ChatRoomItem from '../../componenets/chatting/ChatRoomItem';
import Color from '../../constants/Colors';
import EmptyList from '../../componenets/chatting/EmptyList';
import { ChatSocketContext } from '../../utils/sockets/ChatSocket';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import { setUser } from '../../redux/reducers/userSlice';
import { token_storage } from '../../redux/config/storage';
import { chatExitHandler } from '../../redux/actions/chatAction';
import { setChatRooms } from '../../redux/reducers/chatSlice';
import { updateLastChat } from '../../redux/reducers/chatSlice';
import { appAxios } from '../../redux/config/apiConfig';

interface RoomData {
  id: string;
  title: string;
  lastChat: string;
  lastChatAt: string;
  isAlarm: boolean;
  userImage: string;
  username: string;
  nickname: string;
  unreadCount: number;
}

const Chatting: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const dispatch = useAppDispatch();

  // 정렬 함수
  const sortByLastChatAtDesc = (rooms: RoomData[]) => {
    return [...rooms].sort(
      (a, b) => new Date(b.lastChatAt).getTime() - new Date(a.lastChatAt).getTime()
    );
  };

  useEffect(() => {
    if (!socket) return;

    const handleGetChatList = () => {
      setIsLoading(true);
      socket.emit('room-list', { token: access_token });
      socket.on('room-list', ({ data: { chatRoomList } }) => {
        const sortedRooms = sortByLastChatAtDesc(chatRoomList);
        dispatch(
          setChatRooms(
            sortedRooms.map((room: RoomData) => ({
              id: room.id,
              lastChat: room.lastChat,
              lastChatAt: room.lastChatAt,
              unreadCount: room.unreadCount,
            }))
          )
        );
        setRooms(sortedRooms);
        setIsLoading(false);
      });
    };

    const handleRoomUpdated = (data: { roomId: string; lastMessage: string; lastMessageAt: string; unreadCount: number }) => {
      const { roomId, lastMessage, lastMessageAt, unreadCount } = data;
      dispatch(updateLastChat({ roomId, lastChat: lastMessage, lastChatAt: lastMessageAt, unreadCount }));
      setRooms((prevRooms) => {
        const updated = prevRooms.map((room) =>
          room.id === roomId
            ? { ...room, lastChat: lastMessage, lastChatAt: lastMessageAt, unreadCount }
            : room
        );
        return sortByLastChatAtDesc(updated);
      });
    };

    handleGetChatList();

    socket.on('room-updated', handleRoomUpdated);

    return () => {
      socket.off('room-list');
      socket.off('room-updated');
      setIsLoading(false);
    };
  }, [socket, dispatch]);

  const onExitPressHandler = async (id: string) => {
    Alert.alert(
      '채팅방 나가기',
      '채팅방을 나가면 대화 내용이 모두 삭제되며 복구할 수 없어요. 채팅방을 나갈까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '나가기',
          onPress: async () => {
            const isExit = await dispatch(chatExitHandler(id));
            if (isExit == "true") {
              setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
            } else {
              console.log("채팅방 나가기 실패");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onToggleNotificationHandler = async (id: string) => {
    try {
      await appAxios.patch(`/chat/alarm/${id}`);
      console.log('알람 끄기 ㅇㅋ');
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9", justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color='#202632' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: "#F9F9F9",
        }}
      >
        <Text style={[TYPOS.headline3, { color: Color.black }]}>채팅</Text>
      </View>
      <FlatList
        contentContainerStyle={{
          backgroundColor: "#F9F9F9",
          flex: 1,
        }}
        keyExtractor={(item) => item.id}
        data={rooms}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatRoomItem
            username={item.username}
            nickname={item.nickname}
            unreadCount={item.unreadCount}
            roomId={item.id}
            userImage={item.userImage}
            roomName={item.title}
            timeStamp={item.lastChatAt}
            content={item.lastChat}
            isNotificationEnabled={item.isAlarm}
            onExitPressHandler={() => {
              onExitPressHandler(item.id);
            }}
            onToggleNotificationHandler={() => {
              onToggleNotificationHandler(item.id);
            }}
          />
        )}
        ListEmptyComponent={<EmptyList />}
      />
    </SafeAreaView>
  );
};

export default Chatting;
