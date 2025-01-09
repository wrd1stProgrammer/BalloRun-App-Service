import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';

const OrderWriteLocation = () => {
  // 전남대학교 영역
  const jnuRegion = {
    latitude: 35.176735,
    longitude: 126.908421,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // 전남대학교 경계 폴리곤 (예제)
  const jnuBoundary = [
  { latitude: 35.182031, longitude: 126.897108 }, // 좌상단
  { latitude: 35.182031, longitude: 126.911955 }, // 우상단
  { latitude: 35.171504, longitude: 126.911955 }, // 우하단
  { latitude: 35.171504, longitude: 126.897108 }, // 좌하단
  { latitude: 35.182031, longitude: 126.897108 }, // 닫힘 (첫 좌표와 동일)
  ];

  const [region, setRegion] = useState(jnuRegion);

  // 지도 이동 제한
  const handleRegionChange = (newRegion:Region) => {
    const minLat = Math.min(...jnuBoundary.map((point) => point.latitude));
    const maxLat = Math.max(...jnuBoundary.map((point) => point.latitude));
    const minLng = Math.min(...jnuBoundary.map((point) => point.longitude));
    const maxLng = Math.max(...jnuBoundary.map((point) => point.longitude));

    const limitedRegion = {
      latitude: Math.max(minLat, Math.min(newRegion.latitude, maxLat)),
      longitude: Math.max(minLng, Math.min(newRegion.longitude, maxLng)),
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    };

    setRegion(limitedRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={jnuRegion}
        onRegionChangeComplete={handleRegionChange} // 지도 이동 제한
      >
        {/* 전남대학교 경계 표시 */}
        <Polygon
          coordinates={jnuBoundary}
          strokeColor="rgba(0,0,255,0.8)" // 경계선 색상
          fillColor="rgba(0,0,255,0.1)" // 내부 채우기 색상
          strokeWidth={2}
        />

        {/* 화면 중앙에 마커 */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="현재 위치"
          description={`위도: ${region.latitude.toFixed(6)}, 경도: ${region.longitude.toFixed(6)}`}
        />
      </MapView>
      <View style={styles.coordinateBox}>
        <Text style={styles.text}>위도: {region.latitude.toFixed(6)}</Text>
        <Text style={styles.text}>경도: {region.longitude.toFixed(6)}</Text>
      </View>
    </View>
  );
};

const customMapStyle = [
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }], // 텍스트 숨기기
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  coordinateBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderWriteLocation;