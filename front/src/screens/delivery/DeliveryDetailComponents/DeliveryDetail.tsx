import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";
import DeliveryDetailBottomSheet from "./DeliveryDetailBottomSheet";

type DeliveryItem = {
  _id: string;
  name: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupHolder";
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder";
};

type RouteParams = {
  DeliveryDetail: {
    deliveryItem: DeliveryItem;
  };
};

const DeliveryDetail: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "DeliveryDetail">>();
  const { deliveryItem } = route.params;
  if (!deliveryItem) return null;

  const mapRef = useRef<MapView>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: parseFloat(deliveryItem.lat),
          longitude: parseFloat(deliveryItem.lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(deliveryItem.lat),
            longitude: parseFloat(deliveryItem.lng),
          }}
          title={deliveryItem.items[0].menuName}
          description={deliveryItem.address}
        />
        {userLat && userLng && (
          <Marker
            coordinate={{ latitude: userLat, longitude: userLng }}
            title="내 위치"
            pinColor="blue"
          />
        )}
      </MapView>

      <TouchableOpacity
        onPress={() => {
          if (userLat && userLng) {
            mapRef.current?.animateToRegion({
              latitude: userLat,
              longitude: userLng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
        style={styles.currentLocationButton}
      >
        <Ionicons name="navigate" size={24} color="#000" />
      </TouchableOpacity>

      <DeliveryDetailBottomSheet deliveryItem={deliveryItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  currentLocationButton: {
    position: "absolute",
    bottom: 280,
    right: 16,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default DeliveryDetail;