import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";
import Geolocation from "react-native-geolocation-service";

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string; // 주문 유형
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
  deliveryItems: DeliveryItem[];
  loading: boolean;
  onMarkerSelect: (item: DeliveryItem | null) => void;
  onFilter: (type: string | null) => void; // 필터 핸들러
  userLat: any,
  userLng: any,
};

function DeliveryCustomMap({ userLat, userLng , deliveryItems, loading, onMarkerSelect, onFilter }: DeliveryCustomMapProps) {
  // 현재 위치 상태 관리

  console.log(userLat, userLng)


  const handleMarkerPress = (item: DeliveryItem) => {
    onMarkerSelect(item); // 선택된 주문 전달
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 지도 화면 */}
      <MapView
        style={{ flex: 1 }}
        region={
          userLat && userLng
            ? {
                latitude: userLat,
                longitude: userLng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 35.1767, // 기본 위치 (사용자 위치가 없을 경우)
                longitude: 126.9085,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
      >
        {userLat && userLng && (
          <Marker
            coordinate={{
              latitude: userLat,
              longitude: userLng,
            }}
            title="내 위치"
            description="현재 위치입니다."
            pinColor="blue" 
          />
        )}

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
    marginBottom: 10, // 버튼 간 간격
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