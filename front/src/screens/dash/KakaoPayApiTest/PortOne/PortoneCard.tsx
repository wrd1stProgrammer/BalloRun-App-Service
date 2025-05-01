import { useRoute } from '@react-navigation/native';
import React, { createRef, useEffect } from 'react';
import { Alert, BackHandler, SafeAreaView } from 'react-native';
import { Payment, PortOneController, } from '@portone/react-native-sdk';
//import { completePaymentHandler } from '../../../../redux/actions/paymentAction';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { navigate } from '../../../../navigation/NavigationUtils';
import { neworderCompleteHandler } from '../../../../redux/actions/newOrderAction';
import { refetchUser } from '../../../../redux/actions/userAction';
import { setIsOngoingOrder } from '../../../../redux/reducers/userSlice';
import { uploadFile } from '../../../../redux/actions/fileAction';


function PortoneCard() {
  const controller = createRef<PortOneController>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { paymentId, orderName, totalAmount, easyPayProvider, orderDetails } = route.params as any;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (controller.current?.canGoBack) {
        controller.current.webview?.goBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, []);

  const handlePaymentComplete = async () => {
    try {
      const imageResponse = orderDetails.images ? await dispatch(uploadFile(orderDetails.images, "neworderInfo_image")) : null;
      const imageResponse2 = orderDetails.selectedImageUri ? await dispatch(uploadFile(orderDetails.selectedImageUri, "neworderPickup_image")) : null;

      await dispatch(neworderCompleteHandler(
        paymentId,
        orderDetails.name,
        orderDetails.orderDetails,
        orderDetails.priceOffer,
        orderDetails.deliveryFee,
        orderDetails.riderRequest,
        imageResponse || "",
        imageResponse2 || "",
        orderDetails.finalLat,
        orderDetails.finalLng,
        orderDetails.finalAddress,
        orderDetails.deliveryMethod,
        orderDetails.startTime,
        orderDetails.endTime,
        orderDetails.selectedFloor,
        orderDetails.resolvedAddress,
        orderDetails.usedPoints
      ));

      await dispatch(refetchUser());
      dispatch(setIsOngoingOrder(true));

      Alert.alert('성공', '주문이 성공적으로 처리되었습니다.');
      navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
    } catch (error) {
      Alert.alert('오류', '주문 처리 중 문제가 발생했습니다.');
      navigate("BottomTab", { screen: "HomeScreen" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Payment
        ref={controller}
        request={{
          storeId: 'store-68c88836-7529-4771-9a3a-ee81b2552a83',
          channelKey: 'channel-key-e760a2da-6273-4d91-a47d-322d03bba0f9',
          paymentId: paymentId,
          orderName: orderName,
          totalAmount: totalAmount,
          currency: 'CURRENCY_KRW',
          payMethod: 'CARD',
          customer: {
            fullName: '포트원', // 실제 사용자 정보로 대체 가능
            phoneNumber: '010-0000-1234',
            email: 'test@portone.io',
          },
          customData: {
            item: '1222',
          },
        }}
        onError={(error) => Alert.alert('실패', error.message)}
        onComplete={handlePaymentComplete}
      />
    </SafeAreaView>
  );
}

export default PortoneCard;
