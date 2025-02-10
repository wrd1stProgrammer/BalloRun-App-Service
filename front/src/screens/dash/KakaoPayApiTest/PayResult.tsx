import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// 네비게이션 타입 정의
type RootStackParamList = {
  PayResult: { pgToken: string };
  PaymentComplete: { data: KakaoPaymentApprovalResponse };
  PaymentError: undefined;
};

type PayResultRouteProp = RouteProp<RootStackParamList, 'PayResult'>;
type PayResultNavigationProp = StackNavigationProp<RootStackParamList>;

interface PayResultProps {
  route: PayResultRouteProp;
  navigation: PayResultNavigationProp;
}

// 카카오 결제 승인 응답 타입
interface KakaoPaymentApprovalResponse {
  aid: string;
  tid: string;
  cid: string;
  amount: {
    total: number;
    tax_free: number;
  };
}

const PayResult: React.FC<PayResultProps> = ({ route, navigation }) => {
  const { pgToken } = route.params;

  useEffect(() => {
    const completePayment = async () => {
      try {
        const tid = await AsyncStorage.getItem('tid');
        if (!tid) {
          throw new Error('TID not found');
        }

        const response: AxiosResponse<KakaoPaymentApprovalResponse> = await axios.post(
          'https://open-api.kakaopay.com/online/v1/payment/approve',
          {
            cid: 'TC0ONETIME',
            tid,
            partner_order_id: 'order_123',
            partner_user_id: 'user_123',
            pg_token: pgToken,
          },
          {
            headers: {
                Authorization: 'SECRET_KEY DEV207E038DDC08485749249AE59767ACB3A6CF7', // admin
              'Content-Type': 'application/json', // ?
            },
          }
        );

        // navigation.replace('PaymentComplete', { data: response.data });
      } catch (error) {
        console.error('결제 승인 오류:', error);
        // navigation.replace('PaymentError');
      }
    };

    completePayment();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>결제 진행 중...</Text>
    </View>
  );
};

export default PayResult;
