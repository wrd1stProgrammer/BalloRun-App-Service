// src/screens/Address/FindMap.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { getCurrentLocation } from "../../../../utils/Geolocation/getCurrentLocation";
import { getAddressFromCoords } from "../useGooglePlaces"; // 경로 확인
import { goBack, navigate } from "../../../../navigation/NavigationUtils";
import { Ionicons } from "@expo/vector-icons";

const FindMap = () => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fetchingAddress, setFetchingAddress] = useState(false);

  // ✅ 권한 요청 및 초기 위치 설정
  useEffect(() => {
    const requestPermissionAndLocate = async () => {
      const location = await getCurrentLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      const { latitude, longitude } = location;
      const newRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      setLoading(false);
      fetchAddress(latitude, longitude);
    };

    requestPermissionAndLocate();
  }, []);

  // ✅ 좌표로 주소 가져오기
  const fetchAddress = async (lat: number, lng: number) => {
    setFetchingAddress(true);
    const foundAddress = await getAddressFromCoords(lat, lng);
    setAddress(foundAddress || "주소를 찾을 수 없습니다.");
    setFetchingAddress(false);
  };

  const onRegionChangeComplete = (reg: Region) => {
    setRegion(reg);
    fetchAddress(reg.latitude, reg.longitude);
  };

  const handleSelectLocation = () => {
    if (!region || !address) return;
    navigate("AddressDetailScreen", {
      selectedAddress: address,
      lat: region.latitude,
      lng: region.longitude,
    });
  };

  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={{ marginTop: 10 }}>지도를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
      />
      {/* 고정된 마커 대신 이모지 */}
      <View style={styles.markerFixed}>
        <Text style={{ fontSize: 30 }}>📍</Text>
      </View>

      {/* 주소 표시 */}
      <View style={styles.addressBox}>
        {fetchingAddress ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.addressText}>{address}</Text>
        )}
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleSelectLocation}>
        <Text style={styles.confirmText}>이 위치로 선택</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FindMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -15,
    marginTop: -30,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  addressBox: {
    position: "absolute",
    top: Platform.OS === "ios" ? 120 : 80,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 4,
  },
  addressText: { fontSize: 14, color: "#333" },
  confirmButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
