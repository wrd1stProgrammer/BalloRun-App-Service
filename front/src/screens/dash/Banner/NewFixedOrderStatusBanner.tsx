import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

const NewFixedOrderStatusBanner: React.FC<{ 
  order: OrderStatus | null; 
  isOngoingOrder: boolean; 
  isMatching: boolean 
}> = ({ order, isOngoingOrder, isMatching }) => {
  // isOngoingOrder와 isMatching이 모두 true이고, order가 존재할 때만 렌더링
  if (!isOngoingOrder || !isMatching || !order) return null;

  // createdAt을 Date로 변환하여 남은 시간 계산 (더미로 12분 유지)
  const createdAtDate = new Date(order.createdAt);
  const now = new Date();

  // tmp function
  const timeDiff = Math.max(0, 12 - Math.floor((now.getTime() - createdAtDate.getTime()) / 60000)); // 12분에서 차감

  return (
    <View style={newFixedStyles.container}>
      <Text style={newFixedStyles.message}>
        {`주문이 ${order.status} 상태입니다`}
      </Text>
      <View style={newFixedStyles.timeContainer}>
        <Text style={newFixedStyles.time}>{`예상 시간 :`} </Text>
        <Text style={newFixedStyles.dummyTime}>{timeDiff}분</Text>
      </View>
    </View>
  );
};

const newFixedStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 투명하면서 살짝 어두운 검정색 (투명도 0.7)
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute', // 화면에 고정
    bottom: 90, // 하단 탭 바(70~80px) 위에 위치 (BottomTab의 tabBar 높이 고려)
    left: 15,
    right: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3, // 안드로이드 그림자
    zIndex: 1000, // 다른 요소 위에 표시
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF', // 흰색 텍스트
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row', // 남은 시간과 더미 텍스트를 가로로 나열
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 세로 중앙 정렬
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#FFFFFF', // 흰색 텍스트
    textAlign: 'center',
  },
  dummyTime: {
    fontSize: 12,
    color: '#FFFFFF', // 흰색 텍스트
    fontWeight: 'bold', // 강조를 위해 볼드 처리
    marginLeft: 5, // "남은 시간:"과 "몇 분" 사이 간격
  },
});

export default NewFixedOrderStatusBanner;