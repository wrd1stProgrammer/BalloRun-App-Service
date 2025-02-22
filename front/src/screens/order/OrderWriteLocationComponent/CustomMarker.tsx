import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

interface CustomMarkerProps {
  marker: {
    image: any;
    title: string;
    id: string;
  };
  isSelected: boolean; // 선택된 마커인지 여부 추가
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
    borderColor: 'gray', // 기본 색상
  },
  selectedMarker: {
    borderColor: 'red', // 선택된 마커는 빨간색 테두리
    backgroundColor: '#ffe6e6', // 선택된 마커의 배경 색상 변경
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
  selectedText: {
    color: 'red', // 선택된 마커의 텍스트 색상 변경
  },
});

export default CustomMarker;