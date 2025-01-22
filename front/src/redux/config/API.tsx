import { IPV4,PORT } from '@env';
import {Platform} from 'react-native';

// FOR LOCAL

export const BASE_URL = 
  Platform.OS === 'android'
    ? `http://10.0.2.2:${PORT}`
    : `http://${IPV4}:${PORT}`;

// RUNNING ON REAL DEVICE USE YOUR NETWORK IP TO ACCESS ON REAL DEVICE
//eg http://192.168.29.88:3000


//ex 
export const REGISTER = `${BASE_URL}/auth/register`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const REFRESH_TOKEN = `${BASE_URL}/auth/refreshToken`;