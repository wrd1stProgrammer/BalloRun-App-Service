import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// data의 타입 정의
interface BannerData {
  _id: string;
  orderId: string;
  name: string;
  orderDetails: string;
  deliveryFee: string;
  lat: string;
  lng: string;
}

// props의 타입 정의
interface BannerSectionProps {
  data: BannerData;
}

const BannerSection: React.FC<BannerSectionProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {data.name}
        </Text>
        <Text style={styles.orderDetails} numberOfLines={1} ellipsizeMode="tail">
          {data.orderDetails}
        </Text>
        <Text style={styles.deliveryFee}>배달팁: {data.deliveryFee}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 365,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  orderDetails: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginRight: 8,
  },
  deliveryFee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A67F8', // 보라색으로 강조
  },
});

export default BannerSection;