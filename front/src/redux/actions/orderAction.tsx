import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';


// 지금 배달 Action
export const orderNowHandler = (
  items:any[], // 명시적으로 타입 정의
  lat: string,
  lng: string,
  pickupTime: number,
  isMatch: boolean,
  deliveryType: 'direct' | 'cupHolder',
  deliveryFee: Number,
) => async (dispatch: any) => {
  try {
    const res = await appAxios.post(`/order/orderNow`, {
      items,
      lat,
      lng,
      pickupTime,
      isMatch,
      deliveryType,
      deliveryFee,
    });

    return res.data;
  } catch (error) {
    console.error('주문 요청 실패:', error);
    throw error;
  }
};


  //예약 배달 Action
  export const orderLaterHandler = (
    items: any[],
    lat: string,
    lng: string,
    isMatch: boolean,
    pickupTime: Number, // any?
    deliveryType: 'direct' | 'cupHolder' 
  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/order/orderLater`, {
        items, 
        lat,
        lng,
        isMatch,
        deliveryType,
        pickupTime,
      });
  
      return res.data;
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      throw error;
    }
  };

  export const getCompletedOrdersHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getCompletedOrders`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const getOngoingOrdersHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getOngoingOrders`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

