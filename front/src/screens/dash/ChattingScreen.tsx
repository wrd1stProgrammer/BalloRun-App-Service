import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import TYPOS from '../../componenets/chatting/etc/TYPOS';
import ChatRoomItem from '../../componenets/chatting/ChatRoomItem';
import Color from '../../constants/Colors';
import EmptyList from '../../componenets/chatting/EmptyList';
import { ChatSocketContext } from '../../utils/sockets/ChatSocket';
import { useAppDispatch,useAppSelector } from '../../redux/config/reduxHook';
import { setUser } from '../../redux/reducers/userSlice';
import axios from 'axios';
import useOverlay from '../../componenets/chatting/etc/useOverlay';
import Dialog from '../../componenets/chatting/etc/Dialog';
import { token_storage } from '../../redux/config/storage';

// 전부 필수 데이터
interface RoomData {
  id: string;
  title: string;
  lastChat: string;
  lastChatAt: string;
  isAlarm: boolean;
  image: string;
}

const Chatting:React.FC= () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const socket = useContext(ChatSocketContext);
  const access_token = token_storage.getString('access_token');
  const overlay = useOverlay();

  useEffect(() => {
    console.log('채팅방 유스이ㅂㅔㄱ트');
    if (!socket) return;
    // 채팅방 목록 가져오기
    const handleGetChatList = () => {
      socket.emit('room-list', {
        token: access_token,
      });
      socket.on('room-list', ({ data: { chatRoomList } }) => {
        setRooms(chatRoomList);
      });
    };

    handleGetChatList();

    return () => {
      socket.off('room-list');
    };
  }, [socket]);
 

  const onExitPressHandler = async (id: string) => {
    overlay.open(
      <Dialog isOpened={true}>
        <Dialog.Content content='채팅방을 나가면 대화 내용이 모두 삭제되며 복구할 수 없어요. 채팅방을 나갈까요?' />
        <Dialog.Buttons
          buttons={[
            {
              label: '취소',
              onPressHandler: overlay.close,
            },
            {
              label: '나가기',
              // 나가기 API 작성 예정
              onPressHandler: async () => {
                try {
                  // 액션으로 분리 하자
                  const {
                    data: { chatRoomList },
                  } = await axios.patch(`/chat/leave/${id}`);
                  setRooms(chatRoomList);
                } catch (error) {
                  console.log(error);
                } finally {
                  overlay.close();
                }
              },
            },
          ]}
        />
      </Dialog>
    );
  };
// 채팅방 알람 끄기 설정 -> api 제작 해야함
  const onToggleNotificationHandler = async (id: string) => {
    try {
      const {
        data: { chatRoomList },
      } = await axios.patch(`/chat/alarm/${id}`);
      setRooms(chatRoomList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
            roomId={item.id}
            image={item.image}
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
    </>
  );
};

export default Chatting;
