import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import CustomMarker from "../OrderWriteLocationComponent/CustomMarker";
import { navigate } from "../../../navigation/NavigationUtils";

interface CafeCustomMapViewProps {
  cafes: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    rating: number;
    icon: any; // 이미지 경로
  }[];
}

const CafeCustomMapView: React.FC<CafeCustomMapViewProps> = ({ cafes }) => {
  const [selectedCafe, setSelectedCafe] = useState<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    rating: number;
    icon: any;
  } | null>(null);
  const handleMarkerPress = (cafe: any) => {
    setSelectedCafe(cafe);
  };

  const handleNavigate = () => {
    if (selectedCafe) {
      navigate("CafeMenuListScreen", { cafeName: selectedCafe.name });
      setSelectedCafe(null); // 모달 닫기
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.176735,
          longitude: 126.908421,
          latitudeDelta: 0.005,
          longitudeDelta: 0.002,
        }}
      >
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            coordinate={{
              latitude: cafe.latitude,
              longitude: cafe.longitude,
            }}
            onPress={() => handleMarkerPress(cafe)}
          >
            <CustomMarker
              marker={{
                image: cafe.icon,
                title: `${cafe.name}`,
              }}
            />
          </Marker>
        ))}
      </MapView>

      {/* Modal for selected cafe */}
      {selectedCafe && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedCafe}
          onRequestClose={() => setSelectedCafe(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.cafeName}>{selectedCafe.name}</Text>
              <Text style={styles.cafeRating}>Rating: {selectedCafe.rating}</Text>
              <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                <Text style={styles.buttonText}>이동하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCafe(null)}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CafeCustomMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cafeRating: {
    fontSize: 16,
    marginBottom: 20,
  },
  navigateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
