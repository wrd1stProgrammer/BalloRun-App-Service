import React from 'react';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { CustomMapViewProps } from './CustomMapViewProps';
import CustomMarker from './CustomMarker';

const CustomMapView: React.FC<CustomMapViewProps> = ({
  deliveryMethod,
  region,
  onRegionChangeComplete,
  jnuBoundary,
  markers,
  onMarkerPress,
}) => {
  const [floor, setFloor] = React.useState(false);

  React.useEffect(() => {
    setFloor(deliveryMethod === 'direct');
  }, [deliveryMethod]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {/* Draw a polygon boundary */}
      <Polygon
        coordinates={jnuBoundary}
        strokeColor="rgba(0,0,255,0.8)"
        fillColor="rgba(0,0,255,0.1)"
        strokeWidth={2}
      />

      {/* Add current location marker */}
      {floor &&
      
      <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="현재 위치"
        />
        }

      {/* Conditionally render markers */}
      {!floor && (
        <>

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => onMarkerPress(marker)}
            >
              {/* Render a custom marker */}
              <CustomMarker marker={marker} />
            </Marker>
          ))}
        </>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default CustomMapView;
