import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FixedOrderStatusBanner: React.FC = () => {
  return (
    <View style={fixedStyles.container}>
      <Text style={fixedStyles.message}>주문이 진행 중이에요</Text>
      <View style={fixedStyles.timeContainer}>
        <Text style={fixedStyles.time}>남은 시간: </Text>
        <Text style={fixedStyles.dummyTime}>12분</Text>
      </View>
    </View>
  );
};

const fixedStyles = StyleSheet.create({
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

export default FixedOrderStatusBanner;