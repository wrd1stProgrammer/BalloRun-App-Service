import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FixedOrderStatusBanner: React.FC = () => {
  // 남은 시간 예시 (실제로는 props나 상태로 동적 전달 가능)
  const remainingTime = "10분";

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.message}>주문 요청이 완료되었습니다</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>남은 시간: </Text>
          <Text style={styles.timeValue}>{remainingTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 90, // 하단 탭 바 위에 고정
    left: 16,
    right: 16,
    zIndex: 1000, // 다른 요소 위에 표시
  },
  container: {
    backgroundColor: '#2563EB', // 단일 파란색 배경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16, // 부드러운 모서리
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // 안드로이드 그림자
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF', // 흰색 텍스트
    textAlign: 'center',
    letterSpacing: 0.5, // 세련된 텍스트 간격
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#E5E7EB', // 밝은 회색
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default FixedOrderStatusBanner;