import React, { FC,useState,useEffect } from "react";
import {View, Text, StyleSheet, Animated, Alert, Linking} from 'react-native';
import { useAppDispatch } from "../../redux/config/reduxHook";
import { token_storage } from "../../redux/config/storage";
import {jwtDecode} from 'jwt-decode';
import { navigate,resetAndNavigate } from "../../navigation/NavigationUtils";
import { refresh_tokens } from "../../redux/config/apiConfig";
import { refetchUser } from "../../redux/actions/userAction";
import Logo from "../../assets/images/splash.png";
import { requestUserPermission } from "../../utils/fcm/fcmToken";


interface DecodedToken {
  exp: number;
}

const SplashScreen: FC = () => {

  const [isStop, setIsStop] = useState(false);
  const scale = new Animated.Value(1);
  
  const dispatch = useAppDispatch();

  const tokenCheck = async () => {
    const access_token = token_storage.getString('access_token') as string;
    const refresh_token = token_storage.getString('refresh_token') as string;

    console.log(access_token,refresh_token,'토큰');

    if (access_token) {

      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen'); // token expired -> LoginScreen 
        Alert.alert('Session Expired, please login again');
        return false;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          await refresh_tokens(); // 토큰 가져와야지지
          dispatch(refetchUser());
        } catch (error) {
          console.log(error);
          Alert.alert('There was an error');
          return false;
        }
      }
      resetAndNavigate('BottomTab'); // token access 시 Main 화면
      return true;
    }
    navigate('LoginScreen'); // token deny 시 LoginScreen 

  };

  useEffect(() => {
    console.log("시작");
    tokenCheck();
    
  }, []);

  return(
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={Logo}
          style={{
            width: '90%',
            height: '90%',
            flex:1,
            resizeMode: 'contain',
            transform: [{scale}],
          }}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;


/*

1. token check 
- ok -> BottomTab navigate
- fail -> LoginScreen

2. Spalsh Animation 

*/