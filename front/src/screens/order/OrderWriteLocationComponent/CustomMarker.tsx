import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";

interface CustomMarkerProps {
  marker: {
    image: any;
    title: string;
    id: string;
  };
  isSelected: boolean;
}

const CustomMarker: React.FC<CustomMarkerProps> = React.memo(({ marker, isSelected }) => (
  <View style={styles.customMarker}>
    <View style={[styles.markerContainer, isSelected && styles.selectedMarker]}>
      <Image source={marker.image} style={styles.markerImage} />
      <Text style={[styles.markerText, isSelected && styles.selectedText]}>
        {marker.title}
      </Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  customMarker: {
    alignItems: "center",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: 70,
    height: 80,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  selectedMarker: {
    borderColor: "red",
    backgroundColor: "#ffe6e6",
  },
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 5,
  },
  markerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  selectedText: {
    color: "red",
  },
});

export default CustomMarker;
