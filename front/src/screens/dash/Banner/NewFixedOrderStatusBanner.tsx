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
  // 조건 체크
  if (!isOngoingOrder || !isMatching || !order) return null;

  const createdAtDate = new Date(order.createdAt);
  const now = new Date();
  const timeDiff = Math.max(0, 12 - Math.floor((now.getTime() - createdAtDate.getTime()) / 60000));

  // 터치 시 LiveMap으로 이동
  const handlePress = () => {
    navigate('LiveMap', {
      orderId: order.orderId,
      status: order.status,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={newFixedStyles.container}>
      <Text style={newFixedStyles.message}>
        {`주문이 ${order.status} 상태입니다`}
      </Text>
      <View style={newFixedStyles.timeContainer}>
        <Text style={newFixedStyles.time}>남은 시간: </Text>
        <Text style={newFixedStyles.dummyTime}>{timeDiff}분</Text>
      </View>
    </TouchableOpacity>
  );
};

const newFixedStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    bottom: 90,
    left: 15,
    right: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    zIndex: 1000,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dummyTime: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default NewFixedOrderStatusBanner;