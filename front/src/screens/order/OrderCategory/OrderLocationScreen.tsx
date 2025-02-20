import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker,Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";

import CustomMarker from "../OrderWriteLocationComponent/CustomMarker";

import { markers } from "../../../componenets/cupholderMarkerLoc"; // 컵홀더 위치 데이터 불러오기

type RootStackParamList = {
  OrderLocationScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    deliveryMethod: string
  };
};

type OrderLocationScreenRouteProp = RouteProp<RootStackParamList, "OrderLocationScreen">;

const OrderLocationScreen = () => {
  const route = useRoute<OrderLocationScreenRouteProp>();
  const orderData = route.params;
  const { deliveryMethod } = route.params;


  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null); 
  const [floor, setFloor] = useState(false)

  const jnuBoundary = [
    { latitude: 35.182031, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.911955 },
    { latitude: 35.171504, longitude: 126.897108 },
    { latitude: 35.182031, longitude: 126.897108 },
  ];

  useEffect(() => {
    setFloor(deliveryMethod === 'direct');
  }, [deliveryMethod]);


  useEffect(() => {
 
      setLocation({
        latitude: 35.176735,
        longitude: 126.908421,

    });
  }, []);

  const handleRegionChange = (region: { latitude: number; longitude: number }) => {
    setLocation(region);
  };

  const handleConfirmLocation = () => {
    if (!location) return;
    navigate("OrderFinalScreen", { ...orderData, lat: location.latitude, lng: location.longitude, selectedMarker  });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      
      {location ? (
      <MapView
      style={styles.map}
      initialRegion={{
        latitude: 35.176735,
        longitude: 126.908421,
        latitudeDelta: 0.005,
        longitudeDelta: 0.002,
      }}
      onRegionChangeComplete={handleRegionChange}
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
            latitude: location.latitude,
            longitude: location.longitude,
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
              onPress={() => setSelectedMarker(marker)}
            >
              {/* Render a custom marker */}
              <CustomMarker marker={marker} />
            </Marker>
          ))}
        </>
      )}
    </MapView>
  ) : (
    <Text style={styles.loadingText}>위치 정보를 불러오는 중...</Text>
  )}


      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
        <Text style={styles.buttonText}>배달장소 선택 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
  },
  confirmButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderLocationScreen;
