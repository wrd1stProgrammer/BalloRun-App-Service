import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import BannerSection from './BannerSection';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { getNewOrderToBanner } from '../../../redux/actions/orderAction';
import { View, Text, StyleSheet } from 'react-native'; // 추가된 import
import { Dimensions } from 'react-native';

// 배너 데이터 타입 정의
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
  const [slideTime, setSlideTime] = useState<number>(1); // 초기 슬라이딩 시간 1초
  const [bannerLists, setBannerLists] = useState<BannerData[]>([]); // 배너 데이터 상태
  const dispatch = useAppDispatch();
  const screenWidth = Dimensions.get('window').width;

  const fetchData = async () => {
    try {
      console.log('fetchData 시작');
      const data = await dispatch(getNewOrderToBanner()); // API 호출
      console.log(data,'fetchData');
      setBannerLists(data.data); // 데이터 상태 업데이트
    } catch (error) {
      console.error('배너 데이터 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트 마운트 시 데이터 불러오기
    const autoTimer = setTimeout(() => setSlideTime(8), 1000); // 1초 후 슬라이딩 시간 변경
    return () => clearTimeout(autoTimer); // 타이머 정리
  }, []);

  return (
    <>
      {bannerLists.length > 0 ? (
        <Swiper
          autoplay
          showsPagination={false}
          width={screenWidth}
          height={80}
          autoplayTimeout={slideTime}
        >
          {bannerLists.map((banner) => (
            <BannerSection key={banner._id} data={banner} />
          ))}
        </Swiper>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>근처에 요청된 배달이 없습니다</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    width: 365,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});