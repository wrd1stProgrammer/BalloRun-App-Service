/*
import messaging from '@react-native-firebase/messaging';
import { navigate } from '../../navigation/NavigationUtils';
import notifee, { AndroidChannel } from '@notifee/react-native';

// 포그라운드 알림 핸들러
export const setupForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    showCustomNotification(
      remoteMessage.notification?.title || '알림',
      remoteMessage.notification?.body || '',
      remoteMessage.data,
    );
  });
};

// 백그라운드 알림 핸들러
export const setupBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleNotificationAction(remoteMessage.data);
  });
};

// 앱이 종료된 상태에서 알림 클릭 시
export const onNotificationOpenedApp = () => {
  // 앱이 백그라운드에서 실행 중일 때 알림 클릭 처리
  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationAction(remoteMessage.data);
  });

  // 앱이 완전히 종료된 상태에서 실행될 때 알림 클릭 처리
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationAction(remoteMessage.data);
      }
    });
};

// 딥링크 핸들러 --> 알림 터치시 로직 data type 에 따라 다른 로직 설정
const handleNotificationAction = (data: any) => {
  if (data?.type === 'chat') {
    navigate('ChatRoom', { roomId: data.roomId });
  }
};

// 커스텀 알림 UI --> notifee를 사용하여 알림 표시
const showCustomNotification = async (title: string, body: string, data: any) => {
  const channelId = 'default_channel_id';
  
  try {
    // notifee 채널 생성
    await notifee.createChannel({
      id: channelId,
      name: 'default',
    });

    // notifee를 사용하여 알림 표시
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: channelId,
      },
      data: data,
    });
  } catch (error) {
    console.error('Failed to display notification:', error);
  }
};
*/

import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { navigate } from '../../navigation/NavigationUtils';

//  포그라운드 알림 핸들러
export const setupForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    showCustomNotification(
      remoteMessage.notification?.title || '알림',
      remoteMessage.notification?.body || '',
      remoteMessage.data,
    );
  });
};

//  백그라운드 알림 핸들러
export const setupBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleNotificationAction(remoteMessage.data);
  });
};

//  앱이 종료된 상태에서 알림 클릭 시
export const onNotificationOpenedApp = () => {
  // 앱이 백그라운드에서 실행 중일 때 알림 클릭 처리
  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationAction(remoteMessage.data);
  });

  // 앱이 완전히 종료된 상태에서 실행될 때 알림 클릭 처리
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationAction(remoteMessage.data);
      }
    });
};

//  딥링크 핸들러 --> 알림 터치시 로직 data type 에 따라 다른 로직 설정
const handleNotificationAction = (data: any) => {
  if (data?.type === 'order_accepted') {
    navigate('HomeScreen', { orderId: data.orderId }); //  screen다시
  }else if(data?.type === 'chat'){
    navigate('ChatRoom', {orderId:data.chatRoomId});
  }
};

//  커스텀 알림 UI --> alert OR toast 쓰되 알림 형태 일정하게 코딩해야 됨.
const showCustomNotification = (title: string, body: string, data: any) => {
  Alert.alert(title, body, [
    { text: '취소', style: 'cancel' },
    {
      text: '확인',
      onPress: () => handleNotificationAction(data),
    },
  ]);
};
