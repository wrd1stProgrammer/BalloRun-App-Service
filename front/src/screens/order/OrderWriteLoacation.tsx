import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Modalize } from "react-native-modalize";
import OrderModal from "./OrderModal.tsx/OrderModal";

const { height } = Dimensions.get("window");

interface Coordinates {
  latitude: number;
  longitude: number;
}

const OrderWriteLocation: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      modalRef.current?.open();
    })();
  }, []);

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location ? location.latitude : 37.541,
          longitude: location ? location.longitude : 126.986,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        style={styles.map}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="현재 위치"
          />
        )}
      </MapView>
      <OrderModal modalRef={modalRef} height={height}/>
      <View style={styles.buttonContainer}>
        <Button title="모달 열기" onPress={handleOpenModal} />
      </View>
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
  handle: {
    backgroundColor: "#ccc",
    height: 6,
    width: 60,
    alignSelf: "center",
    borderRadius: 3,
  },
  modal: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  modalContent: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  timeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeOption: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    width: "48%",
  },
  optionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: "#d9b3ff",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    width: "48%",
    color: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default OrderWriteLocation;