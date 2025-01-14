import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";

interface CafeCustomMapViewProps {
  cafes: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    rating: number;
  }[];
}

const CafeCustomMapView: React.FC<CafeCustomMapViewProps> = ({ cafes }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 35.1595454, // 초기 지도 중심 (예: 광주)
        longitude: 126.8526012,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          coordinate={{
            latitude: cafe.latitude,
            longitude: cafe.longitude,
          }}
          title={cafe.name}
          description={`Rating: ${cafe.rating}`}
        />
      ))}
    </MapView>
  );
};

export default CafeCustomMapView;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
