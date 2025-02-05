import axios from 'axios';
import {BASE_URL, REFRESH_TOKEN} from './API';
import {token_storage} from './storage';
import {Alert} from 'react-native';
import { resetAndNavigate } from '../../navigation/NavigationUtils';

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async config => {
  const access_token = token_storage.getString('access_token');
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // 만약 요청이 /auth/login, /auth/register 등이라면 refresh_tokens() 시도하지 않도록
      if (error.config.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await refresh_tokens();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log('Error Refreshing Token');
      }
    }
    return Promise.reject(error);
  },
);


export const refresh_tokens = async () => { //여기 수정필요
  try {
    const refresh_token = token_storage.getString('refresh_token');
    console.log("클라 리프레시 토큰 재발급에서 rf 토큰 :", refresh_token);
    const response = await axios.post(REFRESH_TOKEN, {
      refresh_token,
    });
    const new_access_token = response.data.access_token;
    const new_refresh_token = response.data.refresh_token;
    console.log(new_access_token);
    token_storage.set('access_token', String(new_access_token));
    token_storage.set('refresh_token', String(new_refresh_token));
    return new_access_token;
  } catch (error) {
    console.log('REFRESH TOKEN ERROR',error);
    token_storage.clearAll();
    resetAndNavigate('LoginScreen');
  }
};