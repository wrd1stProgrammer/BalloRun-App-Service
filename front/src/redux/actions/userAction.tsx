import { token_storage } from '../config/storage';
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

const handleSignInSuccess = async (res: any, dispatch: any) => {
  token_storage.set('access_token', res.data.tokens.access_token);
  token_storage.set('refresh_token', res.data.tokens.refresh_token);
  await dispatch(setUser(res.data.user));
  resetAndNavigate('BottomTab');
};

/*
const handleSignInError = (error: any, data: RegisterData) => {
  console.log(error);
  if (error.response.status == 401) {
    navigate('RegisterScreen', {
      ...data,
    });
    return;
  }
  Alert.alert('We are facing issues, try again later');
};
*/
export const login = (userId: string, password: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/login', {
      userId: userId,
      password: password,
    });

    // 로그인 성공 시 처리
    await handleSignInSuccess(res, dispatch);
  } catch (error: any) {
    // 서버 에러 메시지 처리
    if (error.response) {
      console.error('로그인 실패:', error.response.data.message || error.response.data);
      Alert.alert('로그인 실패', error.response.data.message || '로그인에 실패했습니다.');
    } else {
      console.error('네트워크 에러:', error.message);
      Alert.alert('네트워크 오류', '서버와 연결되지 않았습니다. 나중에 다시 시도해주세요.');
    }
  }
};


export const register = (email:string, userId:string, password:string, username:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/register',{
      email:email, 
      userId:userId,
      password:password,
      username:username,
    });
    resetAndNavigate('LoginScreen');
    
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
};





export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
    
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
}; // api Ok.

export const Logout = () => async (dispatch: any) => {
  console.log("로그아웃 액션 동작");
  await token_storage.clearAll();
  await persistor.purge();
  resetAndNavigate('LoginScreen');
};

