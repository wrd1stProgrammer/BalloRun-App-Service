// src/utils/FcmHandler.tsx
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';


// 여기부터 다시.. -> 백,포 그라운드 설정 클라에서 어떻게 하더라 서버는 기억나는데 토큰도 보내는 것 구현 ㄱ
const FcmHandler = () => {
  const navigation = useNavigation();

  //  포그라운드 알림 핸들러
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('포그라운드 알림:', remoteMessage);
      // 토스트 표시 또는 상태 업데이트
    });

    return unsubscribe;
  }, []);

  // 백그라운드/포그라운드 전환 알림 핸들러
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('백그라운드 알림 클릭:', remoteMessage);
      handleDeepLink(remoteMessage.data);
    });

    return unsubscribe;
  }, []);

  // 앱 완전 종료 상태에서 알림 클릭 핸들러
  useEffect(() => {
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('앱 종료 상태 알림 클릭:', remoteMessage);
        
      }
    });
  }, []);



  return null; // 
};

export default FcmHandler;