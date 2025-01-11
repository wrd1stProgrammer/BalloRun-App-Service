import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

interface CustomMarkerProps {
  marker: {
    image: any;
    title: string;
  };
}

const CustomMarker: React.FC<CustomMarkerProps> = React.memo(({ marker }) => (
  <View style={styles.customMarker}>
    <View style={styles.markerContainer}>
      <Image source={marker.image} style={styles.markerImage} />
      <Text style={styles.markerText}>{marker.title}</Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  customMarker: {
    alignItems: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'red',
  },
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  markerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CustomMarker;