import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { token_storage } from '../../../redux/config/storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  PayResult: { pgToken: string };
  PaymentComplete: { data: KakaoPaymentApprovalResponse };
  PaymentError: undefined;
};

type MemberShipNavigationProp = StackNavigationProp<RootStackParamList, 'PayResult'>;

interface MemberShipProps {
  navigation: MemberShipNavigationProp;
}

interface KakaoPaymentReadyResponse {
  tid: string;
  next_redirect_mobile_url: string;
}

interface KakaoPaymentApprovalResponse {
  aid: string;
  tid: string;
  cid: string;
  amount: {
    total: number;
    tax_free: number;
  };
}

const MemberShip: React.FC<MemberShipProps> = ({ navigation }) => {
  const [payVisible, setPayVisible] = useState<boolean>(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);

  const startPayment = async () => {
    try {
      const response = await axios.post<KakaoPaymentReadyResponse>(
        'https://open-api.kakaopay.com/online/v1/payment/ready',
        {
          cid: 'TC0ONETIME',
          partner_order_id: 'order_123',
          partner_user_id: 'user_123',
          item_name: 'coffeee',
          quantity: 1,
          total_amount: 5500,
          tax_free_amount: 0,
          approval_url: 'https://developers.kakao.com/success',
          cancel_url: 'https://developers.kakao.com/cancel',
          fail_url: 'https://developers.kakao.com/fail',
        },
        {
          headers: {
            Authorization: 'SECRET_KEY DEV207E038DDC08485749249AE59767ACB3A6CF7',
            'Content-Type': 'application/json',
          },
        }
      );

      await AsyncStorage.setItem('tid', response.data.tid);
      setPayUrl(response.data.next_redirect_mobile_url);
      setPayVisible(true);
    } catch (error) {
      console.error('결제 시작 오류:', error);
      navigation.navigate('PaymentError');
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url.startsWith('https://developers.kakao.com/success')) {
      setPayVisible(false);
      const pgToken = new URL(navState.url).searchParams.get('pg_token');
      if (pgToken) {
        navigation.navigate('PayResult', { pgToken });
      }
    }
    // if 문으로 cancel , fail 처리
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={startPayment}
        style={{ padding: 20, backgroundColor: '#FFE500' }}
      >
        <Text>5,500원 결제하기</Text>
      </TouchableOpacity>

      {payVisible && payUrl && (
        <WebView
          source={{ uri: payUrl }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </View>
  );
};

export default MemberShip;