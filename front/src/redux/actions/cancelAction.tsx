
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';

export const getOrderDataForCancel = (orderId:string,orderType:string) => async(dispatch: any) => {
    try {
        const res = await appAxios.post(`/order/getOrderDataForCancel`,{
            orderId,
            orderType,
        });
        return res.data;
      } catch (error: any) {
        console.log('카페메뉴 불러오기 에러 :  ->', error);
      }
};