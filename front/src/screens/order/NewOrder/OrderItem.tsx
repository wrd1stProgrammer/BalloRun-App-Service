import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { navigate } from '../../../navigation/NavigationUtils';

interface OrderItemProps {
  orderId: string;
  name: string;
  status: 'pending' | 'goToCafe' | 'makingMenu' | 'goToClient' | 'delivered' | 'cancelled' | 'complete';
  createdAt: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  orderType: string;
  imageUrl: any;
  roomId: string;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'pending': return '주문 접수 완료';
    case 'goToCafe': return '카페로 이동 중';
    case 'makingMenu': return '메뉴 준비 중';
    case 'goToClient': return '배달 중';
    case 'delivered': return '배달 완료';
    case 'cancelled': return '주문 취소됨';
    default: return '진행 중';
  }
};

const OrderItem: React.FC<OrderItemProps> = ({ orderId, name, status, createdAt, orderDetails, priceOffer, deliveryFee, orderType, imageUrl, roomId }) => {

  const showOrderDetails = () => {
    navigate("OrderDetailScreen", { orderId, orderType });
  };

  const handleChatPress = () => {
    navigate('ChatRoom', { roomId });
  };

  const handleLocationPress = () => {
    navigate("LiveMap", { orderId, status });
  };

  const handlerOrderCancel = () => {
    Alert.alert(
      '주문 취소 확인',
      '정말 주문을 취소하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: () => navigate('CancelOrderScreen', { orderId, orderType }) }
      ],
      { cancelable: false }
    );
  };

  const handleReviewPress = () => {
    navigate('ReviewScreen', { orderId });
  };

  const handleReorderPress = () => {
    navigate('OrderListScreen');
  };

  const renderActionButton = () => {
    switch (status) {
      case 'pending':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.buttonSpacing]} onPress={handlerOrderCancel}>
            <Text style={styles.actionButtonText}>주문 취소</Text>
          </TouchableOpacity>
        );
      case 'complete':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.buttonSpacing]} onPress={handleReviewPress}>
            <Text style={styles.actionButtonText}>리뷰 작성</Text>
          </TouchableOpacity>
        );
      case 'cancelled':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.buttonSpacing]} onPress={handleReorderPress}>
            <Text style={styles.actionButtonText}>재주문</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity style={[styles.actionButton, styles.buttonSpacing]} onPress={handleLocationPress}>
            <Text style={styles.actionButtonText}>위치 확인</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.status}>{getStatusMessage(status)}</Text>
        <TouchableOpacity onPress={showOrderDetails}>
          <Text style={styles.detailButton}>주문 상세</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image source={imageUrl} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.orderDetails}>{orderDetails}</Text>
          <Text style={styles.price}>가격: {priceOffer}원 | 배달팁: {deliveryFee}원</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.chatButton, styles.buttonSpacing]} onPress={handleChatPress}>
          <Text style={styles.chatButtonText}>채팅 문의</Text>
        </TouchableOpacity>
        {renderActionButton()}
      </View>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  buttonSpacing: {
    marginHorizontal: 5, // 버튼 간격 추가
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#EEE', // 회색 버튼
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#000', // 검정색 글씨
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3366FF', // 기본 파란색 버튼
    paddingVertical: 12, // 버튼 높이 일정하게
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff', // 흰색 글씨
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  detailButton: {
    color: '#3366FF',
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },

});