import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import CustomMarker from "../OrderWriteLocationComponent/CustomMarker";

interface CafeCustomMapViewProps {
  cafes: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    rating: number;
    icon: any; // 이미지 경로
  }[];
}

const CafeCustomMapView: React.FC<CafeCustomMapViewProps> = ({ cafes }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 35.176735,
        longitude: 126.908421,
        latitudeDelta: 0.005,
        longitudeDelta: 0.002,
      }}
    >
      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          coordinate={{
            latitude: cafe.latitude,
            longitude: cafe.longitude,
          }}
        >
          <CustomMarker
            marker={{
              image: cafe.icon,
              title: `${cafe.name}\nRating: ${cafe.rating}`,
            }}
          />
        </Marker>
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
