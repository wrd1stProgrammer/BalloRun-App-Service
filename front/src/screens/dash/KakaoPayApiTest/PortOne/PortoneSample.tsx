import { useRoute } from '@react-navigation/native';
import React, { createRef, useEffect } from 'react';
import { Alert, BackHandler, SafeAreaView } from 'react-native';
import { Payment, PortOneController } from '@portone/react-native-sdk';
import { completePaymentHandler } from '../../../../redux/actions/paymentAction';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { navigate } from '../../../../navigation/NavigationUtils';
function PortOneSample() {
  const controller = createRef<PortOneController>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

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

  const uid = Date.now().toString(16);

  const handlePaymentComplete = async () => {
    try {
      const response = await dispatch(completePaymentHandler(uid, orderId));
      if (response.message === 'Payment completed') {
        Alert.alert('성공', '주문이 성공적으로 처리되었습니다.');
        navigate("BottomTab", {
          screen: "HomeScreen"
        });
      } else if (response.message === 'Virtual account issued') {
        Alert.alert('가상계좌 발급', '가상계좌가 발급되었습니다.');
        navigate("BottomTab", {
          screen: "HomeScreen"
        });
      } else {
        Alert.alert('오류', response.message);
        navigate("BottomTab", {
          screen: "HomeScreen"
        });
      }
    } catch (error) {
      Alert.alert('서버 오류', '결제 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Payment
        ref={controller}
        request={{
          storeId: 'store-68c88836-7529-4771-9a3a-ee81b2552a83',
          channelKey: 'channel-key-e760a2da-6273-4d91-a47d-322d03bba0f9',
          paymentId: uid,
          orderName: '아이스 아메리카노',
          totalAmount: 1,
          currency: 'CURRENCY_KRW',
          payMethod: 'EASY_PAY',
          customer: {
            fullName: '포트원',
            phoneNumber: '010-0000-1234',
            email: 'test@portone.io',
          },
          easyPay: {
            easyPayProvider: 'EASY_PAY_PROVIDER_KAKAOPAY',
          },
          customData: {
            item: '1234',
          },
        }}
        onError={(error) => Alert.alert('실패', error.message)}
        onComplete={handlePaymentComplete}
      />
    </SafeAreaView>
  );
}

export default PortOneSample;
