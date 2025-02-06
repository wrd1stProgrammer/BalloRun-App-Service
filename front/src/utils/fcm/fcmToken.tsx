import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import axios from 'axios';
import { appAxios } from '../../redux/config/apiConfig';

// FCM 토큰 가져오기 
// !! 1. fcm 업뎃 코드 추가 2. fcmToken 수명주기 관리.
export const requestUserPermission = async (userId: string) => {

  const authStatus = await messaging().requestPermission();
  // await messaging().registerDeviceForRemoteMessages()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);

    try {
      const res = await appAxios.post(`/auth/saveFcmToken`,{
        userId,
        fcmToken,
      })
    } catch (error) {
      console.log('save token api error : ', error);
    }
    
  } else {
    console.log(' FCM 권한 거부됨');
  }
};
