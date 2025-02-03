import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import axios from 'axios';

// FCM 토큰 가져오기 (사용자가 알림 허용하면 실행) -> 이 함수 스플래시나 로그인 useEffect 에 추가.?
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    
    // 서버에 토큰 저장 API 만들자 User 모델에 추가 ㄱ , 수명주기 재고민 ㄱ

  } else {
    console.log(' FCM 권한 거부됨');
  }
};
