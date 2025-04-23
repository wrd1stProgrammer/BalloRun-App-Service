import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../../../navigation/NavigationUtils';
import AdMobBanner from '../AdMob/AdMobBanner';

interface OrderListProps {
  user: any;
}

interface Category {
  name: string;
  icon: string | ImageSourcePropType; // 문자열 또는 이미지 소스
  screen: string;
}

const categories: Category[] = [
  { name: '커피', icon: require('../../../assets/Icon/cafe.png'), screen: 'OrderPageScreen' },
  { name: '편의점', icon: require('../../../assets/Icon/cu.png'), screen: 'OrderPageScreen' },
  { name: '물품', icon: require('../../../assets/Icon/product.png'), screen: 'OrderPageScreen' },
  { name: '음식', icon: require('../../../assets/Icon/food.png'), screen: 'OrderPageScreen' },
  { name: '기타', icon: require('../../../assets/Icon/etc.png'), screen: 'OrderPageScreen' },
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
    const status = user?.verificationStatus || 'notSubmitted';

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

  const handleNotSubmitted = () => {
    Alert.alert(
      '배달하기 알림',
      '배달하기 전에 라이더 등록이 필요합니다! (1시간 안에 인증완료)',
      [
        { text: '아니오', style: 'cancel', onPress: () => {} },
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
        { text: '아니오', style: 'cancel', onPress: () => {} },
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
    console.log(user, 'logggggggg');
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
          <View key={index} style={styles.categoryWrapper}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(cat.screen, cat.name)}
            >
              {typeof cat.icon === 'string' ? (
                <Ionicons name={cat.icon} size={28} color="black" />
              ) : (
                <Image source={cat.icon} style={styles.categoryIcon} />
              )}
            </TouchableOpacity>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </View>
        ))}
      </View>

      {/* 배달하기 버튼 */}
      <TouchableOpacity style={styles.deliveryButton} onPress={handleDeliveryPress}>
        <Ionicons name="bicycle" size={28} color="white" style={styles.deliveryIcon} />
        <Text style={styles.deliveryButtonText}>배달하기</Text>
      </TouchableOpacity>

      <View style={styles.bannerContainer}>
        <AdMobBanner />
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
    height: '43%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryWrapper: {
    alignItems: 'center',
    width: '19%',
  },
  categoryButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoryIcon: {
    width: 28,
    height: 28,
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  deliveryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0064FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deliveryIcon: {
    marginRight: 5,
  },
  deliveryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bannerContainer: {
    marginTop: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default OrderListComponent;