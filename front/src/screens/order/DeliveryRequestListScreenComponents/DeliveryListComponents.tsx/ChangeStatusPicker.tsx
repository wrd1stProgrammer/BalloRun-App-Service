import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

// Props 타입 정의
interface ChangeStatusPickerProps {
  onClose: () => void;
  onConfirm: (selectedStatus: string) => void;
}

const ChangeStatusPicker: React.FC<ChangeStatusPickerProps> = ({ onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("movingToCafe"); // 기본 선택 값 설정

  return (
    <View style={styles.pickerContainer}>
      {/* 피커 컨테이너 추가 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(itemValue: string) => setSelectedStatus(itemValue)}
          style={styles.picker} // ✅ 스타일 추가
        >
          <Picker.Item label="배달 상태 선택" value="" />
          <Picker.Item label="상품 구매하러 이동중" value="goTocafe" />
          <Picker.Item label="고객에게 이동중" value="goToClient" />
          <Picker.Item label="제품 픽업 완료" value="makingMenu" />
          <Picker.Item label="배달 완료" value="delivered" />

        </Picker>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity 
        style={styles.confirmButton} 
        onPress={() => {
          if (selectedStatus) {
            onConfirm(selectedStatus);
            
          }
          
        }}
      >
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>

      {/* 닫기 버튼 */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%", // ✅ 전체 너비 사용
  },
  pickerWrapper: {
    width: "100%", // ✅ Picker를 더 넓게 표시
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: "100%", // ✅ Picker를 전체 너비로 설정
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#E57373",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ChangeStatusPicker;