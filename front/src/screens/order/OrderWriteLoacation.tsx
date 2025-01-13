import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import CustomMapView from './OrderWriteLocationComponent/CustomMapView';
import LocationBottomSheet from './OrderWriteLocationComponent/LocationBottomSheet';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  OrderWriteLocation: { deliveryMethod:  'direct' | 'cupHolder' };
};

type OrderWriteLocationRouteProp = RouteProp<RootStackParamList, 'OrderWriteLocation'>;

interface Props {
  route: OrderWriteLocationRouteProp;
}

const OrderWriteLocation: React.FC<Props> = ({ route }) => {
  const { deliveryMethod } = route.params; // navigate에서 전달된 데이터 가져오기
  
  const bottomSheetRef = useRef(null);

  const jnuRegion: Region = {
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
  const [address, setAddress] = useState(`${jnuRegion.latitude}, ${jnuRegion.longitude}`);

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
      <CustomMapView
        region={region}
        onRegionChangeComplete={handleRegionChange}
        jnuBoundary={jnuBoundary}
      />

      <LocationBottomSheet
        address={address}
        deliveryMethod={deliveryMethod} // deliveryMethod를 LocationBottomSheet로 전달
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
