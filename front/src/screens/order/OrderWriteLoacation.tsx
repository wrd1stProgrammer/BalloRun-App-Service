// OrderWriteLocation.tsx
import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import CustomMapView from './OrderWriteLocationComponent/CustomMapView';
import LocationBottomSheet from './OrderWriteLocationComponent/LocationBottomSheet';
import { Region, LatLng } from 'react-native-maps';

type RootStackParamList = {
  OrderWriteLocation: { deliveryMethod: 'direct' | 'cupHolder' };
};

type OrderWriteLocationRouteProp = RouteProp<RootStackParamList, 'OrderWriteLocation'>;

interface Props {
  route: OrderWriteLocationRouteProp;
}

const OrderWriteLocation: React.FC<Props> = ({ route }) => {
  const { deliveryMethod } = route.params; // navigate에서 전달된 데이터 가져오기
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

  const markers = [
    {
      id: 1,
      coordinate: { latitude: 35.179661, longitude: 126.90638 },
      title: 'AI융합대학',
      description: '여기는 마커 1입니다.',
      image: require('../../assets/images/AIpart.png'),
      floors: ["1층"],
    },
    {
      id: 2,
      coordinate: { latitude: 35.177735, longitude: 126.909421 },
      title: '공과대학',
      description: '여기는 마커 2입니다.',
      image: require('../../assets/images/Engineerpart.png'),
      floors: ["2층", "3층"],
    },
    {
      id: 3,
      coordinate: { latitude: 35.178735, longitude: 126.907421 },
      title: '자연과학대학',
      description: '여기는 마커 3입니다.',
      image: require('../../assets/images/AIpart.png'),
      floors: ["1층", "3층"],
    },
  ];

  return (
    <View style={styles.container}>
      {/* 지도 */}
      <CustomMapView
        region={region}
        onRegionChangeComplete={handleRegionChange}
        jnuBoundary={jnuBoundary}
        deliveryMethod={deliveryMethod}
        markers={markers}
      />

      {/* 뒤로가기 아이콘 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 위치 정보 하단 시트 */}
      <LocationBottomSheet
        address={address}
        deliveryMethod={deliveryMethod}
        bottomSheetRef={bottomSheetRef}
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
