import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region, LatLng } from 'react-native-maps';

// Props 타입 정의
interface CustomMapViewProps {
  region: Region; // 지도 영역 정보 (latitude, longitude, latitudeDelta, longitudeDelta)
  onRegionChangeComplete: (region: Region) => void; // 영역 변경 시 호출되는 함수
  jnuBoundary: LatLng[]; // 전남대학교 경계 배열
}

const CustomMapView: React.FC<CustomMapViewProps> = ({ region, onRegionChangeComplete, jnuBoundary }) => {
    


  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      <Polygon
        coordinates={jnuBoundary}
        strokeColor="rgba(0,0,255,0.8)"
        fillColor="rgba(0,0,255,0.1)"
        strokeWidth={2}
      />
      <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        title="현재 위치"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default CustomMapView;
