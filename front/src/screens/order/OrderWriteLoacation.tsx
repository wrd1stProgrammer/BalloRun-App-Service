import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import LocationBottomSheet from './OrderWriteLocationComponent/LocationBottomSheet';
import CustomMapView from './OrderWriteLocationComponent/CustomMapView';

const OrderWriteLocation = () => {
  // 전남대학교 영역
  const jnuRegion = {
    latitude: 35.176735,
    longitude: 126.908421,
    latitudeDelta: 0.005,
    longitudeDelta: 0.002,
  };

  const jnuBoundary = [
    { latitude: 35.182031, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.897108 },
  ];

  const [region, setRegion] = useState(jnuRegion); 
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
  
  const [address, setAddress] = useState(`${jnuRegion.latitude}, ${jnuRegion.longitude}`);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [deliveryFee, setDeliveryFee] = useState('1000원');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const bottomSheetRef = useRef(null);



  const formatTime = (date:any) => `${date.getHours()}시 ${date.getMinutes()}분`;

  return (
    <View style={styles.container}>
      <CustomMapView
        region={region}
        onRegionChangeComplete={handleRegionChange}
        jnuBoundary={jnuBoundary}
      />


      {/* Bottom Sheet */}
      <LocationBottomSheet
        address={address}
        setAddress={setAddress}
        startTime={formatTime(startTime)}
        setStartTime={() => setShowStartPicker(true)}
        endTime={formatTime(endTime)}
        setEndTime={() => setShowEndPicker(true)}
        deliveryFee={deliveryFee}
        setDeliveryFee={setDeliveryFee}
        bottomSheetRef={bottomSheetRef}
      />

      {/* Start Time Picker */}
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              setStartTime(selectedDate);
              if (selectedDate >= endTime) {
                setEndTime(new Date(selectedDate.getTime() + 60 * 60 * 1000));
              }
            }
          }}
        />
      )}

      {/* End Time Picker */}
      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndTime(selectedDate);
          }}
        />
      )}
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
