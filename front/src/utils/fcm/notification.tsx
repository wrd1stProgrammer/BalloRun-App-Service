// src/utils/notifications.ts
import notifee, { EventType, Notification } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { navigate } from '../../navigation/NavigationUtils';
import { appAxios } from '../../redux/config/apiConfig';

// 데이터 타입 정의
interface NotificationData {
  type?: string;
  orderId?: string;
  chatRoomId?: string;
  [key: string]: string | undefined;
}

interface Payload {
  title?: string;
  body?: string;
  data?: any;
}

// FCM 토큰 가져오기 및 업데이트 관리
export const requestUserPermission = async (userId: string): Promise<void> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    await saveFcmToken(userId, fcmToken);

    // FCM 토큰 갱신 리스너 추가
    messaging().onTokenRefresh(async (newToken: string) => {
      console.log('FCM Token refreshed:', newToken);
      await saveFcmToken(userId, newToken);
    });
  } else {
    console.log('FCM 권한 거부됨');
  }
};

// FCM 토큰 서버 저장
const saveFcmToken = async (userId: string, fcmToken: string): Promise<void> => {
  try {
    await appAxios.post('/auth/saveFcmToken', { userId, fcmToken });
    console.log('FCM 토큰 저장 성공');
  } catch (error) {
    console.error('save token api error:', error);
  }
};

// 포그라운드 알림 핸들러
export const setupForegroundNotifications = (): (() => void) => {
  return messaging().onMessage(async remoteMessage => {
    await displayNotification(
      remoteMessage.notification?.title || '알림',
      remoteMessage.notification?.body || '',
      remoteMessage.data as NotificationData
    );
  });
};

// 백그라운드 알림 핸들러
export const setupBackgroundNotifications = (): void => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await displayNotification(
      remoteMessage.notification?.title || '알림',
      remoteMessage.notification?.body || '',
      remoteMessage.data as NotificationData
    );
  });
};

// 앱이 종료된 상태 또는 백그라운드에서 알림 클릭 시
export const onNotificationOpenedApp = (): void => {
  // 앱이 백그라운드에서 실행 중일 때 알림 클릭 처리
  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationAction(remoteMessage.data as NotificationData);
  });

  // 앱이 종료된 상태에서 실행될 때 알림 클릭 처리
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationAction(remoteMessage.data as NotificationData);
      }
    });

  // Notifee로 알림 클릭 이벤트 처리
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification) {
      handleNotificationAction(detail.notification.data as NotificationData);
    }
  });
};
//
// 알림 클릭 시 딥링크 처리
const handleNotificationAction = (data: NotificationData): void => {
  // 주문 요청 완료시 딥링크
    if (data?.type === 'order_accepted') {
    navigate("BottomTab", {
        screen: "DeliveryRequestListScreen"
    });
    // 채팅 알림.
  } else if (data?.type === 'chat' && data.Id) {
    navigate('ChatRoom', { orderId: data.Id });
    // 주문자가 취소 -> 라이더가 보는 화면.
  } else if (data?.type === 'order_cancel' && data.Id){
    navigate("BottomTab", {
        screen: "DeliveryRequestListScreen"
    });
    // 주문 요청 실패 
  } else if(data?.type === 'order_failed') {
    navigate("BottomTab", {
        screen: "HomeScreen"
    });
    // endTime 도달로 자동 주문취소 (지연큐)
  } else if(data?.type === "order_auto_cancelled") {
    navigate("BottomTab", {
        screen: "DeliveryRequestListScreen"
    });
    // 배달매칭 완료 (배달이 수락 됨.)
  } else if(data?.type === "order_accepted") {
    navigate("BottomTab", {
        screen: "DeliveryRequestListScreen"
    });
    // 라이더가 주문 수락 실패 에러핸들링 도달한 푸쉬알림. -> 뭐 이동 x
    // 아래가 주문 완료되어 주문자에게 알람.
  } else if(data?.type === "order_complete" || data?.type === "order_goToCafe" || data?.type === "order_goToClient") {
    navigate("BottomTab", {
        screen: "DeliveryRequestListScreen"
    });
  } 
};

// Notifee를 사용한 커스텀 알림 표시
const displayNotification = async (
  title: string,
  body: string,
  data: NotificationData
): Promise<void> => {
  // 알림 채널 생성 (Android에서 필요)
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
    });
  }

  // 알림 표시
  await notifee.displayNotification({
    title,
    body,
    data, // 딥링크용 데이터
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
      sound: 'default',
      vibrationPattern: [300, 500],
    },
    ios: {
      sound: 'default',
      badgeCount: 1,
    },
  });
};

// iOS 푸시 알림 권한 요청 초기화
export const initializeNotifications = async (): Promise<void> => {
  await notifee.requestPermission(); // Notifee 권한 요청
  //await requestUserPermission(userId); // FCM 권한 요청
  setupForegroundNotifications();
  setupBackgroundNotifications();
  onNotificationOpenedApp();
};

export default initializeNotifications;