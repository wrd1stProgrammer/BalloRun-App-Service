import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";

import CustomMarker from "../OrderWriteLocationComponent/CustomMarker";
import { markers } from "../../../componenets/cupholderMarkerLoc";
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectUser } from "../../../redux/reducers/userSlice";

const { width } = Dimensions.get("window");

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

const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const OrderCupHolderLocationScreen = () => {
  const user = useAppSelector(selectUser);
  const route = useRoute<OrderCupHolderLocationScreenRouteProp>();
  const orderData = route.params;

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [userLat, setUserLat] = useState(35.176735);
  const [userLng, setUserLng] = useState(126.908421);

  const mapRef = useRef<MapView>(null);
  const tabIndicator = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: isMapView ? width / 2 : 0,
      useNativeDriver: false,
    }).start();
  }, [isMapView]);

  const handleConfirmLocation = () => {
    if (!selectedMarker) return;
    navigate("OrderFinalScreen", { ...orderData, selectedMarker });
  };

  const renderListItem = ({ item }: { item: typeof markers[0] }) => {
    const distance = getDistance(
      userLat,
      userLng,
      item.coordinate.latitude,
      item.coordinate.longitude
    ).toFixed(1);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedMarker(item);
          setIsMapView(true); // 리스트에서 선택하면 지도 뷰로 전환
          setTimeout(() => {
            mapRef.current?.animateToRegion({
              latitude: item.coordinate.latitude,
              longitude: item.coordinate.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.001,
            });
          }, 100);
        }}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.distance}>{distance} km</Text>
          <Text numberOfLines={1} style={styles.floorText}>
            {item.floors.join(", ")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isMapView && (
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      )}

      <View style={styles.toggleButtons}>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsMapView(false)}>
          <Text style={styles.toggleButtonText}>리스트로 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsMapView(true)}>
          <Text style={styles.toggleButtonText}>지도로 보기</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.underline, { transform: [{ translateX: tabIndicator }] }]} />
      </View>

      {isMapView ? (
        <>
          <MapView
            ref={mapRef}
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
                onPress={() => {
                  setSelectedMarker(marker);
                  mapRef.current?.animateToRegion({
                    latitude: marker.coordinate.latitude,
                    longitude: marker.coordinate.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.002,
                  });
                }}
              >
                <CustomMarker marker={marker} isSelected={selectedMarker?.id === marker.id} />
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation} disabled={!selectedMarker}>
            <Text style={styles.buttonText}>배달장소 선택 완료</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={markers}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC" },
  backButton: {
    position: "absolute",
    top: 70,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50%",
    height: 2,
    backgroundColor: "black",
  },
  map: {
    flex: 1,
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
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  floorText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  distance: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 2,
  },
});

export default OrderCupHolderLocationScreen;
