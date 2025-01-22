import React from "react";
import MapView from "react-native-maps";

function DeliveryCustomMap() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 35.1767, // 전남대학교의 위도
        longitude: 126.9085, // 전남대학교의 경도
        latitudeDelta: 0.01, // 지도의 확대 수준 설정 (작을수록 더 확대됨)
        longitudeDelta: 0.01, // 지도의 확대 수준 설정 (작을수록 더 확대됨)
      }}
    />
  );
}

export default DeliveryCustomMap;
