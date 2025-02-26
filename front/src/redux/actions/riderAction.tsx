import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../config/reduxHook';
import { clearMenu } from '../reducers/menuSlice';

/*
export const getOrderData = () => async (dispatch: any) => {
    try {
      const res = await appAxios.get('/rider/getOrderData'); // 요청을 POST -> GET으로 변경 (REST API 관점에서 GET이 더 적합)
      if (res.data.success) {
        // Redis에서 가져온 주문 데이터를 Redux 상태에 저장
        dispatch(setOrders(res.data.orders)); // -> 제작해야함
        console.log('주문 데이터를 성공적으로 가져옴:', res.data.orders);
      } else {
        console.log('주문 데이터 없음:', res.data.message);
        // 없을 때 처리 -> ?? 미정 생각각
      }
    } catch (error: any) {
      console.error('주문 데이터 Redis 에서 가져오기 실패:', error);
    }
  };

 */


 //Redux 관리 로직 추가 안 한 TEST ACTION 임 위에 setOrders 관련 등등 추가 필요  최종은 위 코드드
  export const getOrderData = ()=> async (dispatch: any) => {
    try {
      const res = await appAxios.get('/rider/getOrderData'); // 서버로 GET 요청
      if (res.data.success) {
        console.log('주문 데이터를 성공적으로 가져옴:', res.data.orders);
        return res.data.orders; // 주문 데이터를 반환
      } else {
        console.log('주문 데이터 없음:', res.data.message);
        return [];
      }
    } catch (error: any) {
      console.error('주문 데이터 Redis 에서 가져오기 실패:', error);
      return [];
    }
  };

  export const acceptActionHandler = (orderId: string, orderType: "Order" | "NewOrder") => async (dispatch: any) => {
    try {
      const endpoint = orderType === "Order" ? '/rider/acceptOrder' : '/rider/acceptNewOrder';
      const res = await appAxios.post(endpoint, {
        orderId,
      });
      
      return res;
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };
  export const completeActionHandler = (orderId:string,orderType:string)=> async (dispatch: any) => {
    try {
      const res = await appAxios.post('/rider/completeOrder',{
        orderId,
      }); // 서버
      return res;
      
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };



  export const goToCafeHandler = (orderId:string,orderType:string)=> async (dispatch: any) => {
    try {
      const res = await appAxios.post('/rider/goToCafeHandler',{
        orderId,
        orderType,
      }); // 서버
      return res;
      
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };

  export const makingMenuHandler = (orderId:string,orderType:string)=> async (dispatch: any) => {
    try {
      const res = await appAxios.post('/rider/makingMenuHandler',{
        orderId,
        orderType,

      }); // 서버
      return res;
      
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };

  
  export const goToClientHandler = (orderId:string,orderType:string)=> async (dispatch: any) => {
    try {
      const res = await appAxios.post('/rider/goToClientHandler',{
        orderId,
        orderType,

      }); // 서버
      return res;
      
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };

  export const completeOrderHandler = (orderId:string,orderType:string)=> async (dispatch: any) => {
    try {
      const res = await appAxios.post('/rider/completeOrderHandler',{
        orderId,
        orderType,

      }); // 서버
      return res;
      
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      return [];
    }
  };