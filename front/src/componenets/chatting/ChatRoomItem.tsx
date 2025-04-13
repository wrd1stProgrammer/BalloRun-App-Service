import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons'; // Ionicons 추가
import Color from '../../constants/Colors';
import TYPOS from './etc/TYPOS';
import { navigate } from '../../navigation/NavigationUtils';
import { selectChatRoom } from '../../redux/reducers/chatSlice';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';

interface Props {
  roomId: string;
  username: string;
  nickname: string;
  userImage: string;
  roomName: string;
  timeStamp: string;
  content: string;
  isNotificationEnabled?: boolean;
  onExitPressHandler?: () => void;
  onToggleNotificationHandler?: () => void;
  unreadCount: number;
}

const ChatRoomItem = ({
  username,
  nickname,
  roomId,
  userImage,
  roomName,
  timeStamp,
  content,
  isNotificationEnabled,
  onExitPressHandler,
  onToggleNotificationHandler,
  unreadCount,
}: Props) => {
  const chatRoom = useAppSelector((state) => selectChatRoom(state, roomId));
  // 로컬 알림 상태, 초기값은 prop으로부터 세팅
  const [localIsAlarm, setLocalIsAlarm] = useState<boolean>(!!isNotificationEnabled);

  // 리덕스 값이 있으면 사용, 없으면 초기값 사용
  const latestContent = chatRoom?.lastChat ?? content;
  const latestTimeStamp = chatRoom?.lastChatAt ?? timeStamp;
  const latestUnreadCount = chatRoom?.unreadCount ?? unreadCount;

  // Swipeable ref 생성
  const swipeableRef = useRef<Swipeable>(null);

  // 우측 액션 (오른쪽에서 스와이프)
  const renderRightActions = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* 알림 토글 버튼 */}
        <Pressable
          style={{
            backgroundColor: localIsAlarm ? Color.neutral3 : Color.neutral2,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            // 로컬 상태 업데이트: 토글
            setLocalIsAlarm((prev) => !prev);
            // 전달받은 콜백 호출 (백엔드 API 호출)
            if (onToggleNotificationHandler) {
              onToggleNotificationHandler();
            }
            // 스와이프 된 아이템을 닫음
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
          }}
        >
          <Ionicons
            name={localIsAlarm ? "notifications" : "notifications-off-outline"}
            size={24}
            color={Color.white}
          />
        </Pressable>

        {/* 채팅방 나가기 버튼 */}
        <Pressable
          style={{
            backgroundColor: Color.error,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            if (onExitPressHandler) onExitPressHandler();
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
          }}
        >
          <Text style={[{ color: Color.white }, TYPOS.body1]}>나가기</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={1.5}>
      <Pressable onPress={() => navigate('ChatRoom', { roomId, username, nickname, userImage })}>
        <View
          style={{
            backgroundColor: Color.white,
            padding: 16,
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          <Image
            style={{
              width: 48,
              height: 48,
              resizeMode: 'cover',
              borderRadius: 48,
              marginRight: 16,
            }}
            source={{ uri: userImage }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ color: Color.black }, TYPOS.headline4]}>
                  {username}
                </Text>
                {!localIsAlarm && (
                  <Ionicons name="notifications-off-outline" size={16} color={Color.neutral2} style={{ marginLeft: 4 }} />
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ color: Color.neutral2 }, TYPOS.body3]}>
                  {new Date(latestTimeStamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {latestUnreadCount > 0 && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: Color.blue,
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
            </View>
            <View>
              {latestUnreadCount > 0 ? (
                <Text style={[{ color: Color.blue }, TYPOS.body2]}>
                  {`새 메시지 ${latestUnreadCount}개`}
                </Text>
              ) : (
                <Text style={[{ color: Color.neutral1 }, TYPOS.body2]}>
                  {latestContent}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default ChatRoomItem;
