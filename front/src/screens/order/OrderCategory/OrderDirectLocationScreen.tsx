import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  OrderDirectLocationScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    deliveryMethod: string;
  };
};

type OrderDirectLocationScreenRouteProp = RouteProp<RootStackParamList, "OrderDirectLocationScreen">;

const OrderDirectLocationScreen = () => {
  const route = useRoute<OrderDirectLocationScreenRouteProp>();
  const orderData = route.params;
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    setLocation({ latitude: 35.176735, longitude: 126.908421 });
  }, []);

  const handleConfirmLocation = () => {
    if (!location) return;
    navigate("OrderFinalScreen", { ...orderData, lat: location.latitude, lng: location.longitude });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.002,
          }}
        >
          <Marker coordinate={location} title="현재 위치" />
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
  container: { flex: 1 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10, backgroundColor: "white", borderRadius: 20, padding: 10 },
  map: { flex: 1 },
  loadingText: { flex: 1, justifyContent: "center", alignItems: "center", fontSize: 16 },
  confirmButton: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: "black", paddingVertical: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default OrderDirectLocationScreen;