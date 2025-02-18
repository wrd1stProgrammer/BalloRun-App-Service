import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";
import Geolocation from "react-native-geolocation-service";

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string;
  startTime: string;
  deliveryFee: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  isReservation: boolean;
};

type DeliveryCustomMapProps = {
  mapRef: React.RefObject<MapView>;
  deliveryItems: DeliveryItem[];
  loading: boolean;
  onMarkerSelect: (item: DeliveryItem | null) => void;
  onFilter: (type: string | null) => void;
  userLat: number | null;
  userLng: number | null;
  watchId: number | null;
  selectedLat: string | undefined;
  selectedLng: string | undefined;
};

function DeliveryCustomMap({
  mapRef,
  userLat,
  userLng,
  deliveryItems,
  loading,
  onMarkerSelect,
  onFilter,
  selectedLat,
  selectedLng,
  watchId
}: DeliveryCustomMapProps) {
  const [centerLat, setCenterLat] = useState<number | null>(null);
  const [centerLng, setCenterLng] = useState<number | null>(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const markerPressRef = useRef<boolean>(false); // 마커 클릭 감지

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        console.log("위치 추적 중지됨:", watchId);
      }
    };
  }, [watchId]);

  //화면 이동 시 중앙 위치 저장
  const handleRegionChangeComplete = (region: { latitude: number; longitude: number }) => {
    if (!isMarkerSelected) {
      setCenterLat(region.latitude);
      setCenterLng(region.longitude);
    }
  };

  // 마커 클릭 시 해당 위치로 이동
  const handleMarkerPress = (item: DeliveryItem | null) => {
    markerPressRef.current = true; // 마커 클릭 발생
    setTimeout(() => (markerPressRef.current = false), 500); // 0.5초 후 초기화

    if (item) {
      setIsMarkerSelected(true);
      onMarkerSelect(item);
      mapRef.current?.animateToRegion(
        {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  // 지도 클릭 시 원래 centerLat, centerLng 위치로 이동 & 바텀시트 닫기
  const handleMapPress = () => {
    if (markerPressRef.current) return; // 마커 클릭 시 무시

    if (centerLat !== null && centerLng !== null) {
      setIsMarkerSelected(false);
      onMarkerSelect(null);
      mapRef.current?.animateToRegion(
        {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  //GPS 마커 클릭 시 userLat, userLng 위치로 이동
  const handleGpsMarkerPress = () => {
    setIsMarkerSelected(false);
    onMarkerSelect(null);
    if (userLat !== null && userLng !== null) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLat,
          longitude: userLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 지도 화면 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: centerLat ?? 35.175570, // 초기값
          longitude: centerLng ?? 126.907074,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={handleRegionChangeComplete} // 📌 지도 이동 감지
        onPress={handleMapPress} // 📌 지도 클릭 시 기존 위치로 복귀
      >
        {/* 사용자 위치 마커 */}
        {userLat && userLng && (
          <Marker
            coordinate={{
              latitude: userLat,
              longitude: userLng,
            }}
            title="내 위치"
            description="현재 위치입니다."
            pinColor="blue"
            onPress={handleGpsMarkerPress} // 📌 GPS 마커 클릭 시 이동
          />
        )}

        {/* 배달 주문 마커 */}
        {deliveryItems.map((item) => (
          <Marker
            key={item._id}
            coordinate={{
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lng),
            }}
            title={item.items.map((menu) => menu.menuName).join(", ")}
            description={`배달 유형: ${item.deliveryType} \n 배달비: ${item.deliveryFee}원`}
            onPress={() => handleMarkerPress(item)} // 📌 마커 클릭 시 이동
          />
        ))}
      </MapView>

      {/* 필터 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onFilter(null)}>
          <Text style={styles.buttonText}>전체 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onFilter("cupHolder")}>
          <Text style={styles.buttonText}>컵홀더 주문만</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onFilter("direct")}>
          <Text style={styles.buttonText}>직접 주문만</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onFilter("reservation")}>
          <Text style={styles.buttonText}>예약 주문만</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "flex-end",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#212529",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default DeliveryCustomMap;