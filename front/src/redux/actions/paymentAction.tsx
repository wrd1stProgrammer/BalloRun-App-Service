import { appAxios } from '../config/apiConfig';


export const completePaymentHandler =(paymentId:string,orderId:string) => async(dispatch:any) => {
    try {
      const res = await appAxios.post(`/payment/complete`,{
        paymentId,
        orderId,

      });
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }