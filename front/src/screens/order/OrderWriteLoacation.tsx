import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import CustomMapView from './OrderWriteLocationComponent/CustomMapView';
import LocationBottomSheet from './OrderWriteLocationComponent/LocationBottomSheet';
import { Region } from 'react-native-maps';
import { markers } from '../../componenets/cupholderMarkerLoc';


type RootStackParamList = {
  OrderWriteLocation: { deliveryMethod: 'direct' | 'cupHolder' };
};

type OrderWriteLocationRouteProp = RouteProp<RootStackParamList, 'OrderWriteLocation'>;

interface Props {
  route: OrderWriteLocationRouteProp;
}

const OrderWriteLocation: React.FC<Props> = ({ route }) => {
  const { deliveryMethod } = route.params;
  const navigation = useNavigation();
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
const [selectedMarker, setSelectedMarker] = useState<any>(null); // 타입 명시
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
        deliveryMethod={deliveryMethod}
        markers={markers}
        onMarkerPress={setSelectedMarker}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <LocationBottomSheet
        address={address}
        deliveryMethod={deliveryMethod}
        bottomSheetRef={bottomSheetRef}
        markers={markers}
        selectedMarker={selectedMarker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default OrderWriteLocation;
