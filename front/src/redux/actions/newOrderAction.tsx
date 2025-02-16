import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../config/reduxHook';


export const neworderCompleteHandler = (
    name: string,
    orderDetails: string,
    priceOffer: number,
    deliveryTip: number,
    extraRequests: string,
    images: string, // 첨부 이미지
    orderImages: any, // 수령 위치 참고사진들
    latitude: string,
    longitude: string,
    deliveryMethod: 'direct' | 'nonContact', // 직접이냐 비대면이냐
    pickupTime: string | Date,
    deliveryAddress: string,
    pickupTimeDisplay: string
  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/neworder/ordercall`, {
        name,
        orderDetails,
        priceOffer,
        deliveryTip,
        extraRequests,
        images,
        orderImages,
        latitude,
        longitude,
        deliveryMethod,
        pickupTime,
        deliveryAddress,
        pickupTimeDisplay,
      });
  
      return res.data;


    } catch (error: any) {
      console.error('주문 완료 요청 실패:', error);
      throw error;
    }
  };