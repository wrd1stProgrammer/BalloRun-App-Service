import React, { useContext, useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { token_storage } from '../../../redux/config/storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// 네비게이션 타입 정의
type RootStackParamList = {
  PayResult: { pgToken: string };
  PaymentComplete: { data: KakaoPaymentApprovalResponse };
  PaymentError: undefined;
};

type MemberShipNavigationProp = StackNavigationProp<RootStackParamList, 'PayResult'>;

interface MemberShipProps {
  navigation: MemberShipNavigationProp;
}

// 카카오 결제 준비 응답 타입
interface KakaoPaymentReadyResponse {
  tid: string;
  next_redirect_mobile_url: string;
  // 다른 필요한 필드 추가
}

// 카카오 결제 승인 응답 타입
interface KakaoPaymentApprovalResponse {
  aid: string;
  tid: string;
  cid: string;
  amount: {
    total: number;
    tax_free: number;
    // ...
  };
  // 다른 필요한 필드 추가
}



const MemberShip: React.FC<MemberShipProps> = ({ navigation }) => {
  const [payVisible, setPayVisible] = useState<boolean>(false);
  const PayUrl = token_storage.getString("PayUrl") || null;


  

  const startPayment = async () => {
    try {
      const response: AxiosResponse<KakaoPaymentReadyResponse> = await axios.post(
        'https://open-api.kakaopay.com/online/v1/payment/ready',
        {
          cid: 'TC0ONETIME', // test cid
          partner_order_id: 'order_123',
          partner_user_id: 'user_123',
          item_name: 'coffeee',
          quantity: 1,
          total_amount: 5500,
          tax_free_amount:0,
          approval_url: 'https://developers.kakao.com/success',
          cancel_url: 'https://developers.kakao.com/success',
          fail_url: 'https://developers.kakao.com/success',
        },
        {
          headers: {
            Authorization: 'SECRET_KEY DEV207E038DDC08485749249AE59767ACB3A6CF7', // admin
            'Content-Type': 'application/json', // ?
          },
        }
      );

      await AsyncStorage.setItem('tid', response.data.tid);
      console.log('tid', response.data.tid);
      console.log(response.data);
      token_storage.set("PayUrl",response.data.next_redirect_mobile_url);
      console.log("PayUrl",response.data.next_redirect_mobile_url);
      setPayVisible(true);
    } catch (error:any) {
      console.error('결제 시작 오류:', error.response?.data || error.message);
    }
  };
 // navState.url.startsWith('https://developers.kakao.com/success'
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("here??");
    if (0) {
      setPayVisible(false);
      const pgToken = navState.url.split('=')[1];
      console.log(pgToken);
      navigation.navigate('PayResult', { pgToken });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={startPayment}
        style={{ padding: 20, backgroundColor: '#FFE500' }}
      >
        <Text>5,500원 결제하기</Text>
      </TouchableOpacity>

      {payVisible && PayUrl && (
        <WebView
          source={{ uri: PayUrl }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </View>
  );
};


export default MemberShip;