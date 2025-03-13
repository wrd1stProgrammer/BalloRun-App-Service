import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";

import CustomMarker from "../OrderWriteLocationComponent/CustomMarker";
import { markers } from "../../../componenets/cupholderMarkerLoc"; // 컵홀더 위치 데이터 불러오기
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectUser } from "../../../redux/reducers/userSlice";

type RootStackParamList = {
  OrderCupHolderLocationScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    deliveryMethod: string;
  };
};

type OrderCupHolderLocationScreenRouteProp = RouteProp<RootStackParamList, "OrderCupHolderLocationScreen">;

const OrderCupHolderLocationScreen = () => {
  const user = useAppSelector(selectUser);

  const route = useRoute<OrderCupHolderLocationScreenRouteProp>();
  const orderData = route.params;
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const handleConfirmLocation = () => {
    if (!selectedMarker) return;
    navigate("OrderFinalScreen", { ...orderData, selectedMarker });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.176735,
          longitude: 126.908421,
          latitudeDelta: 0.005,
          longitudeDelta: 0.002,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => setSelectedMarker(marker)}
          >
            <CustomMarker marker={marker} />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation} disabled={!selectedMarker}>
        <Text style={styles.buttonText}>배달장소 선택 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10, backgroundColor: "white", borderRadius: 20, padding: 10 },
  map: { flex: 1 },
  confirmButton: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: "black", paddingVertical: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default OrderCupHolderLocationScreen;