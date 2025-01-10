import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import LocationBottomSheet from './LocationBottom/LocationBottomSheet';

const OrderWriteLocation = () => {
  // 전남대학교 영역
  const jnuRegion = {
    latitude: 35.176735,
    longitude: 126.908421,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const jnuBoundary = [
    { latitude: 35.182031, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.897108 },
  ];

  const [region, setRegion] = useState(jnuRegion);
  const [address, setAddress] = useState(`${jnuRegion.latitude}, ${jnuRegion.longitude}`);
  const [startTime, setStartTime] = useState('3시 30분');
  const [endTime, setEndTime] = useState('4시 30분');
  const [deliveryFee, setDeliveryFee] = useState('1000원');

  const bottomSheetRef = useRef(null);

  const handleRegionChange = (newRegion: Region) => {
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
    setAddress(`${limitedRegion.latitude}, ${limitedRegion.longitude}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={jnuRegion}
        onRegionChangeComplete={handleRegionChange}
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

      {/* Bottom Sheet */}
      <LocationBottomSheet
        address={address}
        setAddress={setAddress}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        deliveryFee={deliveryFee}
        setDeliveryFee={setDeliveryFee}
        bottomSheetRef={bottomSheetRef}
      />
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
});

export default OrderWriteLocation;
