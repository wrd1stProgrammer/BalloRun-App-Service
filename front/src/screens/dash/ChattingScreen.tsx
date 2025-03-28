import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, SafeAreaView, Alert, ActivityIndicator } from 'react-native'; // ActivityIndicator 추가
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

// 전부 필수 데이터
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
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleGetChatList = () => {
      setIsLoading(true); // 데이터 요청 시작 시 로딩 상태 활성화
      socket.emit('room-list', { token: access_token });
      socket.on('room-list', ({ data: { chatRoomList } }) => {
        // 리덕스에 마지막 메시지와 시간 저장
        dispatch(
          setChatRooms(
            chatRoomList.map((room: RoomData) => ({
              id: room.id,
              lastChat: room.lastChat,
              lastChatAt: room.lastChatAt,
              unreadCount: room.unreadCount,
            }))
          )
        );
        setRooms(chatRoomList);
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태 비활성화
      });
    };

    const handleRoomUpdated = (data: { roomId: string; lastMessage: string; lastMessageAt: string; unreadCount: number }) => {
      const { roomId, lastMessage, lastMessageAt, unreadCount } = data;
      dispatch(updateLastChat({ roomId, lastChat: lastMessage, lastChatAt: lastMessageAt, unreadCount }));
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, lastChat: lastMessage, lastChatAt: lastMessageAt, unreadCount } : room
        )
      );
    };

    handleGetChatList();

    socket.on('room-updated', handleRoomUpdated);

    return () => {
      socket.off('room-list');
      socket.off('room-updated');
      setIsLoading(false); // 컴포넌트 언마운트 시 로딩 상태 초기화
    };
  }, [socket, dispatch]);

  const onExitPressHandler = async (id: string) => {
    Alert.alert(
      '채팅방 나가기', // 제목
      '채팅방을 나가면 대화 내용이 모두 삭제되며 복구할 수 없어요. 채팅방을 나갈까요?', // 메시지
      [
        {
          text: '취소',
          style: 'cancel', // 취소 버튼
        },
        {
          text: '나가기',
          onPress: async () => {
            const isExit = await dispatch(chatExitHandler(id)); // 채팅방 나가기 액션 실행
            if (isExit == "true") {
              // isExit가 true이면 해당 채팅방을 목록에서 제거
              setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
            } else {
              console.log("채팅방 나가기 실패");
            }
          },
        },
      ],
      { cancelable: true } // 바깥쪽 터치로 닫기 가능
    );
  };

  // 채팅방 알람 끄기 설정 -> api 제작 해야함
  const onToggleNotificationHandler = async (id: string) => {
    try {
      await appAxios.patch(`/chat/alarm/${id}`);
      console.log('알람 끄기 ㅇㅋ');
      // setRooms(chatRoomList);
    } catch (error) {
      console.log(error);
    }
  };

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='#202632' />

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: Color.white,
        }}
      >
        <Text style={[TYPOS.headline3, { color: Color.black }]}>채팅</Text>
      </View>
      <FlatList
        contentContainerStyle={{
          backgroundColor: Color.white,
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