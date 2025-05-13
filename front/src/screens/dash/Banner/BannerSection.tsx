import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

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

const BannerSection: React.FC<BannerSectionProps> = ({ data, distance }) => (
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
        {distance}km | {data.deliveryFee}원
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#00000020',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C851',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  orderDetails: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    textAlign: 'center',
  },
  info: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#777777',
    textAlign: 'right',
  },
});

export default BannerSection;
