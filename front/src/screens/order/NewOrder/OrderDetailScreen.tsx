import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Modal, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { showOrderDetails } from '../../../redux/actions/orderAction';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
}

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId, orderType } = route.params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7f50" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>주문 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 가게 정보 */}
        <View style={styles.card}>
          <Text style={styles.storeName}>{order.name}</Text>
          <Text style={styles.orderType}>{orderType}</Text>
        </View>

        {/* 주문 & 가격 정보 (2열 배치) */}
        <View style={styles.rowContainer}>
          <View style={styles.halfCard}>
            <Text style={styles.sectionTitle}>주문 내역</Text>
            <Text style={styles.orderDetailText}>{order.orderDetails}</Text>
          </View>
          <View style={styles.halfCard}>
            <Text style={styles.sectionTitle}>결제 금액</Text>
            <Text style={styles.totalPrice}>
              ₩{(order.priceOffer + order.deliveryFee).toLocaleString()}
            </Text>
            <Text style={styles.priceDetail}>
              (상품: ₩{order.priceOffer.toLocaleString()} + 배달비: ₩{order.deliveryFee.toLocaleString()})
            </Text>
          </View>
        </View>

        {/* 배달 정보 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>배달 정보</Text>
          <Text style={styles.detailText}>📍 {order.deliveryAddress}</Text>
          <Text style={styles.detailText}>⏰ {order.pickupTimeDisplay}</Text>
          <Text style={styles.detailText}>🛵 {order.deliveryType}</Text>
        </View>

        {/* 상태 정보 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>현재 상태</Text>
          <Text style={styles.status}>{order.status}</Text>
        </View>

        {/* 이미지 (상품 & 픽업 위치) */}
        <View style={styles.imageContainer}>
          {order.images && (
            <TouchableOpacity onPress={() => openImageModal(order.images!)}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: order.images }} style={styles.image} />
                <Text style={styles.imageLabel}>상품 이미지</Text>
              </View>
            </TouchableOpacity>
          )}
          {order.orderImages && (
            <TouchableOpacity onPress={() => openImageModal(order.orderImages!)}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: order.orderImages }} style={styles.image} />
                <Text style={styles.imageLabel}>픽업 위치 이미지</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 이미지 모달 */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeImageModal}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage! }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // iOS 상단 여백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: width * 0.44,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  orderType: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  orderDetailText: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7f50',
  },
  priceDetail: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.45,
    height: 150,
    borderRadius: 8,
  },
  imageLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 10,
  },
});

export default OrderDetailScreen;