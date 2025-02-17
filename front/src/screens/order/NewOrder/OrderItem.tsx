import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface OrderItemProps {
  name: string;
  status: 'pending' | 'goToCafe' | 'makingMenu' | 'goToClient' | 'delivered' | 'cancelled';
  createdAt: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  imageUrl: any; // 로컬 이미지 경로를 받기 위해 any 타입 사용
}

const getStatusMessage = (status: string, createdAt: string) => {
  const date = new Date(createdAt);
  const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;

  switch (status) {
    case 'pending':
      return '주문 접수 완료';
    case 'accepted':
      return '배달 접수 완료';
    case 'makingMenu':
      return '가게로 이동 중';
    case 'goToClient':
      return '고객에게 이동 중';
    case 'delivered':
      return `배달완료 (${formattedDate})`;
    case 'cancelled':
      return `주문 취소 (${formattedDate})`;
    default:
      return '';
  }
};

// 상태에 따른 글자색 반환
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FFA500'; // 주황색 (진행 중)
    case 'accepted':
      return '#007AFF'; // 파란색 (배달 접수)
    case 'makingMenu':
      return '#4CAF50'; // 초록색 (가게로 이동 중)
    case 'goToClient':
      return '#FF6347'; // 토마토색 (고객에게 이동 중)
    case 'delivered':
      return '#888'; // 회색 (완료)
    case 'cancelled':
      return '#FF0000'; // 빨간색 (취소)
    default:
      return '#000'; // 기본 검정색
  }
};

const OrderItem: React.FC<OrderItemProps> = ({ name, status, createdAt, orderDetails, priceOffer, deliveryFee, imageUrl }) => {
  const statusColor = getStatusColor(status); // 상태에 따른 색상 가져오기

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.status, { color: statusColor }]}>{getStatusMessage(status, createdAt)}</Text>
        <TouchableOpacity>
          <Text style={styles.detailButton}>주문상세</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text>
        <Image source={imageUrl} style={styles.image} /> {/* 로컬 이미지 사용 */}
        </Text>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.orderDetails} numberOfLines={2}>{orderDetails}</Text>
          <Text style={styles.price}>{`가격: ${priceOffer}원`} {`배달팁: ${deliveryFee}원`}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" style={styles.button}>채팅 문의</Button>
        <Button mode="outlined" style={styles.button}>위치 보기</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
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
  },
  detailButton: {
    color: '#007AFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    color: '#555',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default OrderItem;