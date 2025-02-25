import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../config/reduxHook';


export const neworderCompleteHandler = (
    name: string,
    orderDetails: string,
    priceOffer: number,
    deliveryFee: number,
    riderRequest: string,
    images: string, // 첨부 이미지
    orderImages: any, // 수령 위치 참고사진들
    lat: string,
    lng: string,
    deliveryAddress: string,
    deliveryMethod: string,

    startTime: number | null,
    endTime: number | null,
    selectedFloor: string | null, 
    resolvedAddress: string | null
  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/neworder/ordercall`, {
        name,
        orderDetails,
        priceOffer,
        deliveryFee,
        riderRequest,
        images,
        orderImages,
        lat,
        lng,
        deliveryAddress,
        deliveryMethod,

        startTime,
        endTime,
        selectedFloor,
        resolvedAddress
      });
  
      return res.data;


    } catch (error: any) {
      console.error('주문 완료 요청 실패:', error);
      throw error;
    }
  };