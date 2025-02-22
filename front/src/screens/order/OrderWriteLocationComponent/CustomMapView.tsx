import React from 'react';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomMarker from './CustomMarker';
import LocationBottomSheet from './LocationBottomSheet';
import { goBack, navigate } from "../../../navigation/NavigationUtils";

interface CustomMapViewProps {
  region: Region;
  onRegionChangeComplete: (region: Region) => void;
  jnuBoundary: { latitude: number; longitude: number }[];
  deliveryMethod: 'direct' | 'cupHolder';
  markers: any[];
  onMarkerPress: (marker: any) => void;
  address: string;
  bottomSheetRef: any;
  selectedMarker: any;
}

const CustomMapView: React.FC<CustomMapViewProps> = ({
  deliveryMethod,
  region,
  onRegionChangeComplete,
  jnuBoundary,
  markers,
  onMarkerPress,
  address,
  bottomSheetRef,
  selectedMarker

}) => {

  const confirmLocation = () => {
      console.log('선택된 배달 위치:', selectedMarker);
      navigate("NewLocationBottom", { address, deliveryMethod,bottomSheetRef,markers,selectedMarker });
  };

  const [floor, setFloor] = React.useState(false);

  React.useEffect(() => {
    setFloor(deliveryMethod === 'direct');
  }, [deliveryMethod]);

  return (
    <View style={styles.container}>
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
            {/* 선택 여부를 CustomMarker에 전달 */}
            <CustomMarker marker={marker} isSelected={selectedMarker && selectedMarker.id === marker.id} />
          </Marker>
        ))}
        </>
      )}
    </MapView>

    <TouchableOpacity 
  style={[styles.confirmButton, selectedMarker ? {} : styles.disabledButton]} 
  onPress={confirmLocation}
  disabled={!(selectedMarker || deliveryMethod === 'direct')}>
  <Text style={styles.confirmButtonText}>배달 위치 결정하기</Text>
</TouchableOpacity>
  </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0', // 회색으로 변경
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    right: '10%',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomMapView;
