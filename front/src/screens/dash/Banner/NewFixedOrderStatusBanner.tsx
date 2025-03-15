import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { navigate } from '../../../navigation/NavigationUtils';

interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

const NewFixedOrderStatusBanner: React.FC<{
  order: OrderStatus | null;
  isOngoingOrder: boolean;
  isMatching: boolean;
}> = ({ order, isOngoingOrder, isMatching }) => {
  if (!isOngoingOrder || !isMatching || !order) return null;

  const createdAtDate = new Date(order.createdAt);
  const now = new Date();
  const timeDiff = Math.max(0, 12 - Math.floor((now.getTime() - createdAtDate.getTime()) / 60000));

  // 상태를 한글로 변환
  const statusMap: { [key: string]: string } = {
    'pending': '매칭 중',
    'accepted': '수락됨',
    'goToClient': '배달 중',
    'completed': '완료됨',
    'cancelled': '취소됨',
  };
  const statusInKorean = statusMap[order.status.toLowerCase()] || '알 수 없음';

  const handlePress = () => {
    navigate('LiveMap', {
      orderId: order.orderId,
      status: order.status,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.85} // 약간의 터치 피드백
    >
      <Text style={styles.message}>{`주문이 ${statusInKorean} 상태입니다`}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>남은 시간:</Text>
        <Text style={styles.timeValue}>{timeDiff}분</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // 더 여유롭게 위로
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 투명한 회색 배경
    borderRadius: 16, // 부드러운 모서리
    paddingVertical: 16, // 더 넉넉한 세로 패딩
    paddingHorizontal: 24, // 더 넉넉한 가로 패딩
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // 은은한 테두리
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  message: {
    fontSize: 16, // 조금 더 큰 글씨
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8, // 시간과의 간격 추가
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 6,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 미세한 하이라이트
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});

export default NewFixedOrderStatusBanner;