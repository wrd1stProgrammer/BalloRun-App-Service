import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useFocusEffect } from "@react-navigation/native";
import BannerSection from "./BannerSection";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { getNewOrderToBanner } from "../../../redux/actions/orderAction";
import { useLocation } from "../../../utils/Geolocation/LocationContext";

const screenWidth = Dimensions.get("window").width;

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
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
      console.log("주변 배달 fetchData 시작");
      const result = await dispatch(getNewOrderToBanner());
      setBannerLists(result.data);
    } catch (error) {
      console.error("배너 데이터 불러오기 실패:", error);
    }
  };

  // 화면에 포커스될 때마다 fetchData 호출
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // 슬라이드 자동 재생 간격을 1초 → 8초로 늘리는 타이머
  useEffect(() => {
    const timer = setTimeout(() => setSlideTime(8), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }: { item: BannerData }) => {
    const distance =
      location && item.lat && item.lng
        ? getDistance(
            location.latitude,
            location.longitude,
            parseFloat(item.lat),
            parseFloat(item.lng)
          ).toFixed(1)
        : "0";
    return <BannerSection data={item} distance={distance} />;
  };

  return (
    <View style={styles.container}>
      {bannerLists.length > 0 ? (
        <Carousel
          data={bannerLists}
          renderItem={renderItem}
          width={screenWidth * 0.95}
          height={50}
          loop
          autoPlay
          autoPlayInterval={slideTime * 1000}
          vertical
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.95,
            parallaxScrollingOffset: 50,
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
    width: "100%",
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    width: "100%",
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "NotoSansKR-Regular",
  },
});
