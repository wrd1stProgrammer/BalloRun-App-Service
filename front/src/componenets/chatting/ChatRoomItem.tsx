import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Color from '../../constants/Colors';
import TYPOS from './etc/TYPOS';
import Pin24 from './etc/Pin24';
import FillPin24 from './etc/FillPin24';
import Bell16 from './etc/Bell16';
import PinIndicator from './etc/PinIndicator';
import { navigate } from '../../navigation/NavigationUtils';

interface Props {
  roomId: string;
  username:string;
  nickname:string;
  userImage: string;
  roomName: string;
  timeStamp: string;
  content: string;
  isNotificationEnabled?: boolean;
  onExitPressHandler?: () => void;
  onToggleNotificationHandler?: () => void;
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
}: Props) => {

  


  const renderRightActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          style={{
            backgroundColor: isNotificationEnabled
              ? Color.neutral3
              : Color.neutral2,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onToggleNotificationHandler}
        >
          <Text style={[{ color: Color.white }, TYPOS.body1]}>{`알림 ${
            isNotificationEnabled ? '끄기' : '켜기'
          }`}</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: Color.error,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onExitPressHandler}
        >
          <Text style={[{ color: Color.white }, TYPOS.body1]}>나가기</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={1.5}
    >
      <Pressable onPress={() => navigate('ChatRoom',{roomId,username,nickname,userImage})}>
      <View
        style={{
          backgroundColor: Color.white,
          padding: 16,
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        <Image
          style={[
            {
              width: 48,
              height: 48,
              resizeMode: 'cover',
              borderRadius: 48,
              marginRight: 16,
            },
          ]}
          source={{
            uri: userImage,
          }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[{ color: Color.black }, TYPOS.headline4]}>
                {username}
              </Text>
              <Text
                style={[
                  { color: Color.neutral2, marginHorizontal: 4 },
                  TYPOS.body3,
                ]}
              >
              </Text>
              {!isNotificationEnabled && <Bell16 color={Color.neutral2} />}
            </View>
            <Text style={[{ color: Color.neutral2 }, TYPOS.body3]}>
              {timeStamp}
            </Text>
          </View>
          <View>
            <Text style={[{ color: Color.neutral1 }, TYPOS.body2]}>
              {content}
            </Text>
          </View>
        </View>
      </View>
      </Pressable>
    </Swipeable>
  );
};

export default ChatRoomItem;
