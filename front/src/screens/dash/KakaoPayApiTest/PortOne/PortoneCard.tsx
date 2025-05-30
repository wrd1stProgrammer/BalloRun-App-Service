import { useRoute } from '@react-navigation/native';
import React, { createRef, useEffect } from 'react';
import { Alert, BackHandler, SafeAreaView } from 'react-native';
import { Payment, PortOneController } from '@portone/react-native-sdk';

import { useAppDispatch, useAppSelector } from '../../../../redux/config/reduxHook';
import { uploadFile } from '../../../../redux/actions/fileAction';
import { neworderCompleteHandler } from '../../../../redux/actions/newOrderAction';
import { refetchUser } from '../../../../redux/actions/userAction';
import { setIsOngoingOrder, selectUser } from '../../../../redux/reducers/userSlice';
import { navigate, goBack } from '../../../../navigation/NavigationUtils';

function PortoneCard() {
  /** refs & hooks */
  const controller = createRef<PortOneController>();
  const dispatch   = useAppDispatch();
  const user       = useAppSelector(selectUser);
  const route      = useRoute();

  /** nav params */
  const {
    paymentId,          // ← 이전 화면에서 만든 임시 paymentId
    orderName,
    totalAmount,
    easyPayProvider,
    orderDetails,
  } = route.params as any;

  /** Android HW back */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (controller.current?.canGoBack) {
        controller.current.webview?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  /** 결제 완료 */
  const handlePaymentComplete = async (result: any) => {
    /** 1) 결제 실패·취소
     * 
     if (result.status !== 'PAID') {
      Alert.alert('다시 시도해주세요', `status: ${result.status}`);
      goBack();
      return;
    }
     */
    

    /** 2) 결제 성공 → 주문 확정 */
    try {
      const imgInfo =
        orderDetails.images &&
        (await dispatch(uploadFile(orderDetails.images, 'neworderInfo_image')));
      const imgPickup =
        orderDetails.selectedImageUri &&
        (await dispatch(uploadFile(orderDetails.selectedImageUri, 'neworderPickup_image')));

      await dispatch(
        neworderCompleteHandler(
          paymentId,
          orderDetails.name,
          orderDetails.orderDetails,
          orderDetails.priceOffer,
          orderDetails.deliveryFee,
          orderDetails.riderRequest,
          imgInfo || '',
          imgPickup || '',
          orderDetails.finalLat,
          orderDetails.finalLng,
          orderDetails.finalAddress,
          orderDetails.deliveryMethod,
          orderDetails.startTime,
          orderDetails.endTime,
          orderDetails.selectedFloor,
          orderDetails.resolvedAddress,
          orderDetails.usedPoints,
        ),
      );

      await dispatch(refetchUser());
      dispatch(setIsOngoingOrder(true));

      Alert.alert('성공', '주문이 성공적으로 처리되었습니다.');
      navigate('BottomTab', { screen: 'DeliveryRequestListScreen' });
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '주문 처리 중 문제가 발생했습니다.');
      navigate('BottomTab', { screen: 'HomeScreen' });
    }
  };

  /** ---------------- render ---------------- */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Payment
        ref={controller}
        request={{
          paymentId:paymentId,
          storeId: 'store-68c88836-7529-4771-9a3a-ee81b2552a83',
          channelKey: 'channel-key-e760a2da-6273-4d91-a47d-322d03bba0f9',
          orderName: orderName,
          totalAmount: totalAmount,
          currency: 'CURRENCY_KRW',
          payMethod: 'CARD',
          customer: {
            fullName: user?.username ?? '',
            phoneNumber: '010-4128-4177',
            email: user?.email ?? '',
          },
          customData: { item: '1222' },
        }}
        onError={(err) => Alert.alert('결제 실패', err.message)}
        onComplete={handlePaymentComplete}
      />
    </SafeAreaView>
  );
}

export default PortoneCard;
