import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';

export const orderNowContactHandler = (
    items: any[],
    lat: string,
    lng: string,
    isMatch: boolean,
    deliveryType: 'direct' | 'cupHolder' 
  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/order/orderNowContact`, {
        items, 
        lat,
        lng,
        isMatch,
        deliveryType,
      });
  
      return res.data;
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      throw error;
    }
  };

