import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../../../navigation/NavigationUtils';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectIsOngoingOrder,setIsOngoingOrder } from '../../../redux/reducers/userSlice';


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
 // { name: '마트', icon: 'medical', screen: 'OrderPageScreen' },
//{ name: '음식', icon: 'fast-food', screen: 'OrderPageScreen' },
//{ name: '물건', icon: 'cart', screen: 'OrderPageScreen' },
  { name: '기타', icon: 'ellipsis-horizontal', screen: 'OrderPageScreen' },
];

const OrderListComponent: React.FC<OrderListProps> = ({ user }) => {



  const handleCategoryPress = (screen: string, name: string) => {
    if (user?.isOngoingOrder) {
      Alert.alert(
        '알림',
        '주문은 동시에 1개만 가능합니다.',
        [
          {
            text: '확인',
            style: 'default',
            onPress: () => {},
          },
        ],
        { cancelable: true }
      );
    } else {
      navigate(screen, { name });
    }
  };

  const handleDeliveryPress = () => {
    console.log(user);
    const status = user?.verificationStatus || 'notSubmitted'; // 기본값 설정
    
    switch (status) {
      case 'notSubmitted':
        handleNotSubmitted();
        break;
      case 'pending':
        handlePending();
        break;
      case 'rejected':
        handleRejected();
        break;
      case 'verified':
        handleVerified();
        break;
      default:
        console.warn('Unknown verification status:', status);
        break;
    }
  };

  // 상태별 핸들러 함수
  const handleNotSubmitted = () => {
    Alert.alert(
      '배달하기 알림',
      '배달하기 전에 라이더 등록이 필요합니다! (1시간 안에 인증완료)',
      [
        {
          text: '아니오',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: '예',
          onPress: () => {
            navigate('RiderManual');
          },
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  const handlePending = () => {
    Alert.alert(
      '배달하기 알림',
      '관리자가 라이더 인증을 심사 중입니다. 잠시만 기다려주세요.',
      [
        {
          text: '확인',
          style: 'default',
          onPress: () => {},
        },
      ],
      { cancelable: true }
    );
  };

  const handleRejected = () => {
    Alert.alert(
      '배달하기 알림',
      '라이더 인증 심사가 거부되었습니다. 다시 신청해주세요.',
      [
        {
          text: '아니오',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: '예',
          onPress: () => {
            navigate('RiderManual');
          },
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  const handleVerified = () => {
    console.log(user,'logggggggg')
    if (user?.isDelivering) {
      Alert.alert('알림', '이미 배달 중입니다.');
    } else {
      navigate('SelectDelivery');
    }
  };

  return (
    <View style={styles.container}>
      {/* 주문하기 제목 추가 */}
      <Text style={styles.title}>심부름 맡기기</Text>

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
    height: '40%',
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