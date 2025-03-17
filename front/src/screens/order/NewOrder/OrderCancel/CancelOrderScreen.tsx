import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { goBack, navigate, resetAndNavigate } from '../../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { getOrderDataForCancel } from '../../../../redux/actions/cancelAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cancelOrderAction } from '../../../../redux/actions/orderAction';
import { clearOngoingOrder } from '../../../../redux/reducers/userSlice';

// 주문 데이터 타입 정의
interface OrderData {
  orderId: string;
  orderType: 'Order' | 'NewOrder';
  price: number | number[];
  deliveryFee: number;
  penaltyAmount: number;
  refundAmount: number;
  totalAmount: number;
  createdAt: string;
  isReservation: boolean;
  isMatched: boolean;
}

// 라우트 파라미터 타입 정의
interface RouteParams {
  orderId: string;
  orderType: 'Order' | 'NewOrder';
}

const CancelOrderScreen: React.FC<{ route: { params: RouteParams } }> = ({ route }) => {
  const { orderId, orderType } = route.params;
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 주문 데이터 가져오기 함수
  const loadOrderData = async () => {
    const data = await dispatch(getOrderDataForCancel(orderId, orderType));
    setOrderData(data);
  };

  // 초기 데이터 로드 및 타이머 설정
  useEffect(() => {
    loadOrderData();

    timerRef.current = setTimeout(() => {
      console.log('3분 경과, 데이터 리로딩');
      loadOrderData();
    }, 180000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [orderId, orderType, dispatch]);

  // 취소 처리 함수
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('오류', '취소 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      console.log('주문 취소 요청:', { orderId, orderType, cancelReason });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      await dispatch(cancelOrderAction(orderId, orderType, cancelReason, orderData?.refundAmount, orderData?.penaltyAmount));
      await dispatch(clearOngoingOrder());
      Alert.alert('성공', '주문이 취소되었습니다.', [
        {
          text: '확인',
          onPress: () =>
            resetAndNavigate('BottomTab', {
              screen: 'DeliveryRequestListScreen',
            }),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '주문 취소 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 뒤로가기 함수
  const handleGoBack = () => {
    goBack();
  };

  if (!orderData) return <Text style={styles.loadingText}>Loading...</Text>;

  // price가 배열인지 숫자인지 확인 후 totalAmount 계산
  const totalAmount = Array.isArray(orderData.price)
    ? orderData.price.reduce((sum, p) => sum + p, 0) + orderData.deliveryFee
    : orderData.price + orderData.deliveryFee;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 20}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#1C2526" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>주문 취소</Text>
        </View>

        {/* 주문 정보 */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>주문 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 금액</Text>
            <Text style={styles.infoValue}>{totalAmount.toLocaleString()}원</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>환불 금액</Text>
            <Text style={styles.infoValue}>{orderData.refundAmount.toLocaleString()}원</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>패널티 금액</Text>
            <Text style={styles.infoValue}>{orderData.penaltyAmount.toLocaleString()}원</Text>
          </View>
        </View>

        {/* 취소 사유 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>취소 사유</Text>
          <TextInput
            style={styles.input}
            placeholder="취소 사유를 입력해주세요 (최대 100자)"
            value={cancelReason}
            onChangeText={setCancelReason}
            multiline
            placeholderTextColor="#999"
            maxLength={100}
          />
        </View>

        {/* 취소 버튼 (하단 고정) */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCancelOrder}
            disabled={loading}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
          >
            {loading ? '처리 중...' : '취소 확인'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
    backgroundColor: '#fff',

  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  orderInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1, // 입력란을 상단에 유연하게 유지
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',

  },
  cancelButton: {
    backgroundColor: '#0066ff',
    borderRadius: 10,
    paddingVertical: 10, // 버튼 높이 약간 증가
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default CancelOrderScreen;