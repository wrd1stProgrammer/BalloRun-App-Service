import { token_storage } from '../config/storage';
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../utils/NavigtionUtils';
import axios from 'axios';
import Toast from 'react-native-toast-message';


export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
    
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
}; // api Ok.

export const Logout = () => async (dispatch: any) => {
  await token_storage.clearAll();
  await persistor.purge();
  resetAndNavigate('LoginScreen');
}; // logout redux logic

