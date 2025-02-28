import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BannerData {
  _id: string;
  orderId: string;
  name: string;
  orderDetails: string;
  deliveryFee: string;
  lat: string;
  lng: string;
}

interface BannerSectionProps {
  data: BannerData;
  distance: string;
}

const BannerSection: React.FC<BannerSectionProps> = ({ data, distance }) => {
  return (
    <View style={styles.card}>
      {/* 초록색 동그라미 */}
      <View style={styles.greenDot} />
      {/* 데이터 배치 */}
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {data.name}
        </Text>
        <Text style={styles.orderDetails} numberOfLines={1} ellipsizeMode="tail">
          {data.orderDetails}
        </Text>
        <Text style={styles.info}>
          배달팁 :{data.deliveryFee}원  {distance}km
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dde2e8',
    paddingHorizontal: 12,
    flexDirection: 'row', // 수평 배치
    alignItems: 'center',
    shadowColor: '#000',
    //shadowOpacity: 0.05,
    //shadowRadius: 2,
    elevation: 1,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00', // 초록색
    marginRight: 8, // 동그라미와 텍스트 간 간격
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'NotoSansKR-Regular',
    flex: 1, // 왼쪽에 고정
  },
  orderDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'NotoSansKR-Regular',
    flex: 2, // 중간에 더 많은 공간 차지
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'NotoSansKR-Regular',
    flex: 1,
    textAlign: 'right',
  },
});

export default BannerSection;