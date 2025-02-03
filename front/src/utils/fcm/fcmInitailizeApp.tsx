import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';


// 아직 ios 만
export const startFcm = async () => {
  if (Platform.OS === 'ios') {
    try {
      const firebaseConfig = {
        appId: '1:391413944888:ios:3428128c718bd8c24e0ccd',
        projectId: 'campuscoffee-83cbf',
      };

      // Firebase 앱 초기화
      const app = await firebase.initializeApp(firebaseConfig);
      console.log('Firebase app initialized:', app);
    } catch (error) {
      console.error('Error initializing Firebase app:', error);
    }
  }
};
