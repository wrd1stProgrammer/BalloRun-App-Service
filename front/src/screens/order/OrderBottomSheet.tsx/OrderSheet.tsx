import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

type OrderSheetProps = {
    isVisible: boolean;
    onClose: () => void;
    region: {
      latitude: number;
      longitude: number;
    };
  };

const OrderSheet: React.FC<OrderSheetProps> = ({ isVisible, onClose, region }) => {
  // 바텀시트 내용
  const renderContent = () => (
    <View style={styles.content}>
      <Text style={styles.title}>위치 정보</Text>
      <Text style={styles.text}>위도: {region.latitude.toFixed(6)}</Text>
      <Text style={styles.text}>경도: {region.longitude.toFixed(6)}</Text>

      {/* 위치 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={onClose}>
        <Text style={styles.saveButtonText}>위치 저장</Text>
      </TouchableOpacity>
    </View>
  );

  // 바텀시트 닫기
  const handleSheetClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={(ref) => {
        if (ref && isVisible) {
          ref.snapTo(0); // 바텀시트 열기
        } else if (ref) {
          ref.snapTo(1); // 바텀시트 닫기
        }
      }}
      snapPoints={[300, 0]} // 최대 높이 300px, 최소 닫힌 상태 0px
      borderRadius={20}
      renderContent={renderContent}
      onCloseEnd={handleSheetClose}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    padding: 20,
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSheet;
