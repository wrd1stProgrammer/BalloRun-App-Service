import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../config/reduxHook';
import { clearMenu } from '../reducers/menuSlice';



// 지금 배달 Action
export const orderNowHandler = (
  items:any[], // 명시적으로 타입 정의
  lat: string,
  lng: string,
  startTime: number, // 픽업희망 시간간
  endTime: number, // 픽업희망 시간간

  isMatch: boolean,
  deliveryType: 'direct' | 'cupHolder',
  deliveryFee: Number,
  riderRequest: string

) => async (dispatch: any) => {
  try {
    const res = await appAxios.post(`/order/orderNow`, {
      items,
      lat,
      lng,
      startTime,  //시작
      endTime,    //끝끝
      isMatch,
      deliveryType,
      deliveryFee,
      riderRequest

    });

        // 주문 성공 시 상태 초기화
    dispatch(clearMenu());

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
    startTime: number, // 주문시작 시간 (예약때만 쓰자);
    endTime: Number, // any?
    isMatch: boolean,
    deliveryType: 'direct' | 'cupHolder' ,
    deliveryFee: Number,
    riderRequest: string
  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/order/orderLater`, {
        items, 
        lat,
        lng,
        isMatch,
        deliveryType,
        startTime,    //시작
        endTime,     //끝나느시간간
        deliveryFee,
        riderRequest
      });

              // 주문 성공 시 상태 초기화
    dispatch(clearMenu());
  
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

