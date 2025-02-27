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
  price: number | number[]; // Order는 배열, NewOrder는 숫자
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
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 타이머 참조

  // 주문 데이터 가져오기 함수
  const loadOrderData = async () => {
    const data = await dispatch(getOrderDataForCancel(orderId, orderType));
    setOrderData(data);
  };

  // 초기 데이터 로드 및 타이머 설정
  useEffect(() => {
    loadOrderData();

    // 3분 타이머 설정
    timerRef.current = setTimeout(() => {
      console.log('3분 경과, 데이터 리로딩');
      loadOrderData(); // 3분 후 리로딩
    }, 180000); // 180초 = 3분

    // 컴포넌트 언마운트 시 타이머 정리
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

      // 타이머 초기화
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      await dispatch(cancelOrderAction(orderId,orderType,cancelReason,orderData?.refundAmount,orderData?.penaltyAmount));

      // status = cancelled, client clear, 라이더 유무에 따라 isDelivering ,
      // 푸시알림으로 라이더에게 알림 -> isDelivering, refetch 하자.
      await dispatch(clearOngoingOrder()); // 주문자 상태 클리어
      Alert.alert('성공', '주문이 취소되었습니다.', [
        { text: '확인', onPress: () => resetAndNavigate('BottomTab',{
            screen: "DeliveryRequestListScreen"
        }) },
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 취소</Text>
      </View>

      {/* 주문 정보 */}
      <View style={styles.orderInfo}>
        <Text style={styles.sectionTitle}>주문 정보</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>주문 ID</Text>
          <Text style={styles.infoValue}>{orderId}</Text>
        </View>
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
          placeholder="취소 사유를 입력해주세요"
          value={cancelReason}
          onChangeText={setCancelReason}
          multiline
          placeholderTextColor="#999"
        />
      </View>

      {/* 취소 버튼 */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  },
  sectionTitle: {
    fontSize: 16,
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
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  cancelButton: {
    backgroundColor: '#0066ff',
    borderRadius: 8,
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 16,
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