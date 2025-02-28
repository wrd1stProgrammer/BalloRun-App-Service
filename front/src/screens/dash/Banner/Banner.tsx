import React, { useState, useEffect } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import BannerSection from './BannerSection';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { getNewOrderToBanner } from '../../../redux/actions/orderAction';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useLocation } from '../../../utils/Geolocation/LocationContext';

const screenWidth = Dimensions.get('window').width;
const bannerWidth = screenWidth * 0.9;

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface BannerData {
  _id: string;
  orderId: string;
  name: string;
  orderDetails: string;
  deliveryFee: string;
  lat: string;
  lng: string;
}

export default function Banner() {
  const [slideTime, setSlideTime] = useState<number>(1);
  const [bannerLists, setBannerLists] = useState<BannerData[]>([]);
  const dispatch = useAppDispatch();
  const { location } = useLocation();

  const fetchData = async () => {
    try {
      console.log('fetchData 시작');
      const data = await dispatch(getNewOrderToBanner());
      console.log(data, 'fetchData');
      setBannerLists(data.data);
    } catch (error) {
      console.error('배너 데이터 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const autoTimer = setTimeout(() => setSlideTime(8), 1000);
    return () => clearTimeout(autoTimer);
  }, []);

  const renderItem = ({ item }) => {
    const distance =
      location && item.lat && item.lng
        ? getDistance(
            location.latitude,
            location.longitude,
            parseFloat(item.lat),
            parseFloat(item.lng)
          ).toFixed(1)
        : '0';
    return <BannerSection data={item} distance={distance} />;
  };

  return (
    <View style={styles.container}>
      {bannerLists.length > 0 ? (
        <Carousel
          data={bannerLists}
          renderItem={renderItem}
          width={screenWidth}
          height={45}
          loop
          autoPlay
          autoPlayInterval={slideTime * 1000}
          vertical // 상하 슬라이드 설정
          style={{ width: screenWidth }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 45, // 수직 간격 조정
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>근처에 요청된 배달이 없습니다</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'NotoSansKR-Regular',
  },
});