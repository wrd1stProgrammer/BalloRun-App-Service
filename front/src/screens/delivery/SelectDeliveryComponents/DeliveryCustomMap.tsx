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
  const [centerLat, setCenterLat] = useState<number | null>(35.175570);
  const [centerLng, setCenterLng] = useState<number | null>(126.907074);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const markerPressRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        console.log("위치 추적 중지됨:", watchId);
      }
    };
  }, [watchId]);

  const handleRegionChangeComplete = (region: { latitude: number; longitude: number }) => {
    if (!isMarkerSelected) {
      setCenterLat(region.latitude);
      setCenterLng(region.longitude);
    }
  };

  const handleMarkerPress = (item: DeliveryItem | null) => {
    markerPressRef.current = true;
    setTimeout(() => (markerPressRef.current = false), 500);

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

  const handleMapPress = () => {
    if (markerPressRef.current) return;

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

  const handleFilterPress = (type: string | null) => {
    setSelectedFilter(type);
    onFilter(type);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: centerLat ?? 35.175570,
          longitude: centerLng ?? 126.907074,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
      >
        {/* 내 위치 마커 */}
        {userLat && userLng && (
          <Marker
            coordinate={{ latitude: userLat, longitude: userLng }}
            title="내 위치"
            description="현재 위치입니다."
            pinColor="blue"
          />
        )}

        {/* 주문 마커 */}
        {deliveryItems.map((item) => (
          <Marker
            key={item._id}
            coordinate={{
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lng),
            }}
            title={item.items.map((menu) => menu.menuName).join(", ")}
            description={`배달 유형: ${item.deliveryType} \n 배달비: ${item.deliveryFee}원`}
            onPress={() => handleMarkerPress(item)}
          />
        ))}
      </MapView>

      {/* 필터 버튼 */}
      <View style={styles.buttonContainer}>
        {[
          { label: "전체 보기", value: null },
          { label: "컵홀더 주문만", value: "cupHolder" },
          { label: "직접 주문만", value: "direct" },
        ].map(({ label, value }) => {
          const isActive = selectedFilter === value;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.filterButton, isActive && styles.activeFilterButton]}
              onPress={() => handleFilterPress(value)}
            >
              <Text style={[styles.filterButtonText, isActive && styles.activeFilterText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 16,
    left: 60,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    zIndex: 5,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  activeFilterButton: {
    backgroundColor: "#111827",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default DeliveryCustomMap;
