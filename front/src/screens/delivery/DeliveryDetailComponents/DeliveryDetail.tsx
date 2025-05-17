import { getDistance } from 'geolib';
import React, { useRef, useState, useEffect } from "react";
import { acceptActionHandler } from "../../../redux/actions/riderAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { navigate } from "../../../navigation/NavigationUtils";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
// import { getWalkingDirections } from "../../../utils/Geolocation/Directions";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";
import DeliveryDetailBottomSheet from "./DeliveryDetailBottomSheet";
import { useAppDispatch } from "../../../redux/config/reduxHook";

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
  const [distance, setDistance] = useState<number | null>(null);
  const [walkingRoute, setWalkingRoute] = useState<{ latitude: number; longitude: number }[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        if (deliveryItem && deliveryItem.lat && deliveryItem.lng) {
          console.log("출발 좌표:", latitude, longitude);
          console.log("도착 좌표:", deliveryItem.lat, deliveryItem.lng);
          const dist = getDistance(
            { latitude, longitude },
            { latitude: parseFloat(deliveryItem.lat), longitude: parseFloat(deliveryItem.lng) }
          );
          setDistance(dist);

          // const route = await getWalkingDirections(
          //   { lat: latitude, lng: longitude },
          //   { lat: parseFloat(deliveryItem.lat), lng: parseFloat(deliveryItem.lng) }
          // );
          // setWalkingRoute(route);
        }
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const acceptHandler = async (orderId: string, orderType: "Order" | "NewOrder") => {
    try {
      await dispatch(acceptActionHandler(orderId, orderType));
      dispatch(setIsOngoingOrder(true));
      setTimeout(() => {
        navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
      }, 1500);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleAccept = () => {
    if (deliveryItem) {
      acceptHandler(deliveryItem._id, deliveryItem.orderType);
    }
  };

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
        {walkingRoute.length > 0 && (
          <Polyline
            coordinates={walkingRoute}
            strokeColor="#006AFF"
            strokeWidth={4}
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

      <DeliveryDetailBottomSheet deliveryItem={deliveryItem} onAccept={handleAccept} distance={distance ?? undefined} />
    </View>
  );
};

const styles = StyleSheet.create({
  currentLocationButton: {
    position: "absolute",
    top: 70,
    right: 25,
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