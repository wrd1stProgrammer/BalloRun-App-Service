import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../../../navigation/NavigationUtils';

interface OrderListProps {
  user: any;
}

interface Category {
  name: string;
  icon: string;
  screen: string;
}

const categories: Category[] = [
  { name: '커피', icon: 'cafe', screen: 'CafeListScreen' },
  { name: '편의점', icon: 'storefront', screen: 'OrderPageScreen' },
  { name: '약', icon: 'medical', screen: 'OrderPageScreen' },
  { name: '음식', icon: 'fast-food', screen: 'OrderPageScreen' },
  { name: '물건', icon: 'cart', screen: 'OrderPageScreen' },
  { name: '기타', icon: 'ellipsis-horizontal', screen: 'OrderPageScreen' },
];

const OrderListComponent: React.FC<OrderListProps> = ({ user }) => {
  const handleCategoryPress = (screen: string, name: string) => {
    navigate(screen, { name });
  };

  const handleDeliveryPress = () => {
    // 1. 라이더로 등록되어 있는지 확인
    if (!user?.isRider) {
      // 라이더로 등록되지 않은 경우 경고창 띄우기
      Alert.alert(
        '배달하기 알림',
        '배달하기 전에 라이더 등록이 필요합니다! (1시간 안에 인증완료)',
        [
          {
            text: '아니오',
            style: 'cancel',
            onPress: () => {}, // 아무 동작 없음
          },
          {
            text: '예',
            onPress: () => {
              navigate('SelectDelivery'); // 라이더 등록 페이지로 이동
            },
            style: 'default',
          },
        ],
        { cancelable: true }
      );
    } else {
      // 2. 라이더로 등록되어 있다면 배달 중인지 확인
      if (user?.isDelivering) {
        // 배달 중인 경우 경고창 띄우기
        Alert.alert('알림', '이미 배달 중입니다.');
      } else {
        // 배달 중이 아니라면 추가 로직 (현재는 비워둠)
        console.log('배달 시작 가능');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 주문하기 제목 추가 */}
      <Text style={styles.title}>주문하기</Text>

      {/* 카테고리 그리드 */}
      <View style={styles.gridContainer}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategoryPress(cat.screen, cat.name)}
          >
            <Ionicons name={cat.icon as any} size={32} color="black" />
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}

        {/* 배달하기 버튼 */}
        <TouchableOpacity style={styles.deliveryButton} onPress={handleDeliveryPress}>
          <Ionicons name="bicycle" size={28} color="white" style={styles.deliveryIcon} />
          <Text style={styles.deliveryButtonText}>배달하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    marginBottom: 10,
    width: '100%',
    height: '47%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 23,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '30%', // 3열 그리드
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deliveryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF', // iPhone 스타일의 파란색
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deliveryIcon: {
    marginRight: 5, // 아이콘과 텍스트 사이 간격
  },
  deliveryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default OrderListComponent;