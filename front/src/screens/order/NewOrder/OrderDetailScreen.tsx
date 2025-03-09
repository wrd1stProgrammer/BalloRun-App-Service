import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { showOrderDetails } from '../../../redux/actions/orderAction';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 360; // 작은 화면 기준 (예: iPhone SE)

type RootStackParamList = {
  OrderDetail: {
    orderId: string;
    orderType: string;
  };
};

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

interface OrderDetails {
  userId: string;
  name: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  riderRequest?: string;
  images?: string;
  orderImages?: string;
  lat: string;
  lng: string;
  deliveryType: string;
  pickupTime: Date;
  deliveryAddress: string;
  pickupTimeDisplay: string;
  status: string;
  isReservation: boolean;
  riderId?: string;
  createdAt: Date;
  usedPoints?: number;
}

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId, orderType } = route.params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const data = await dispatch(showOrderDetails(orderId, orderType));
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, orderType]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>주문 정보를 불러올 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const totalAmount = order.priceOffer + order.deliveryFee;
  const finalAmount = totalAmount - (order.usedPoints || 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={isSmallScreen ? 24 : 26} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 가게 정보 */}
        <View style={styles.section}>
          <Text style={styles.storeName}>{order.name}</Text>
          <Text style={styles.orderType}>{orderType}</Text>
        </View>

        {/* 결제 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 정보</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>최종 결제 금액</Text>
            <Text style={styles.finalAmount}>₩{finalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.detailLabel}>상품 금액</Text>
              <Text style={styles.detailValue}>₩{order.priceOffer.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.detailLabel}>배달비</Text>
              <Text style={styles.detailValue}>₩{order.deliveryFee.toLocaleString()}</Text>
            </View>
            {order.usedPoints > 0 && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.detailLabel}>포인트 할인</Text>
                <Text style={styles.discountValue}>-₩{order.usedPoints.toLocaleString()}</Text>
              </View>
            )}
            {order.usedPoints > 0 && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.detailLabel}>원래 금액</Text>
                <Text style={styles.originalValue}>₩{totalAmount.toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 주문 내역 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 내역</Text>
          <Text style={styles.orderDetails}>{order.orderDetails}</Text>
        </View>

        {/* 배달 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배달 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>주소</Text>
            <Text style={styles.value}>{order.deliveryAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>시간</Text>
            <Text style={styles.value}>{order.pickupTimeDisplay}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>배달 방식</Text>
            <Text style={styles.value}>{order.deliveryType === 'direct' ? '직접 전달' : '비대면'}</Text>
          </View>
        </View>

        {/* 상태 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>현재 상태</Text>
          <Text style={styles.status}>{order.status}</Text>
        </View>

        {/* 이미지 */}
        {(order.images || order.orderImages) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이미지</Text>
            <View style={styles.imageContainer}>
              {order.images && (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: order.images }} style={styles.image} resizeMode="cover" />
                  <Text style={styles.imageLabel}>상품</Text>
                </View>
              )}
              {order.orderImages && (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: order.orderImages }} style={styles.image} resizeMode="cover" />
                  <Text style={styles.imageLabel}>픽업 위치</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecef',
    paddingTop: Platform.OS === 'android' ? 10 : 0, // Android 상태바 고려
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.05, // 화면 너비의 5%로 동적 패딩
    paddingVertical: height * 0.02, // 화면 높이의 2%로 동적 패딩
    paddingBottom: height * 0.05, // 하단 여백
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.05, // 동적 패딩
    marginBottom: height * 0.02, // 동적 마진
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  storeName: {
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderType: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#8e9199',
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  finalAmount: {
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: '700',
    color: '#0066ff',
  },
  paymentDetails: {
    paddingLeft: width * 0.04, // 동적 들여쓰기
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#1a1a1a',
  },
  discountValue: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#00a86b',
  },
  originalValue: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#8e9199',
    textDecorationLine: 'line-through',
  },
  orderDetails: {
    fontSize: isSmallScreen ? 15 : 16,
    color: '#1a1a1a',
    lineHeight: isSmallScreen ? 22 : 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: '#6b7280',
    width: '30%',
  },
  value: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'right',
  },
  status: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#00a86b',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 작은 화면에서 이미지 줄바꿈 허용
    justifyContent: 'flex-start',
    gap: width * 0.04, // 동적 간격
  },
  imageWrapper: {
    alignItems: 'center',
    width: width * 0.42, // 화면 크기에 따라 동적 조정
  },
  image: {
    width: '100%',
    height: width * 0.42, // 정사각형 유지
    borderRadius: 10,
    backgroundColor: '#e8ecef',
  },
  imageLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#6b7280',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f5',
  },
  loadingText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#6b7280',
    marginTop: 8,
  },
  errorText: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OrderDetailScreen;