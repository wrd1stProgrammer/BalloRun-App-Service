import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Platform, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";

// 화면 크기 가져오기
const { height } = Dimensions.get("window");

// Props 타입 정의
interface ChangeStatusPickerProps {
  onClose: () => void;
  onConfirm: (selectedStatus: string) => void;
}

const ChangeStatusPicker: React.FC<ChangeStatusPickerProps> = ({ onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Text style={styles.header}>배달 상태 변경</Text>

      {/* 피커 컨테이너 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(itemValue: string) => setSelectedStatus(itemValue)}
          style={styles.picker}
          dropdownIconColor="#006AFF"
        >
          <Picker.Item label="배달 상태를 선택하세요" value="" enabled={false} />
          <Picker.Item label="가게로 이동 중" value="goTocafe" />
          <Picker.Item label="고객에게 이동 중" value="goToClient" />
          <Picker.Item label="제품 픽업 완료" value="makingMenu" />
          <Picker.Item label="배달 완료" value="delivered" />
        </Picker>
      </View>

      {/* 버튼 컨테이너 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedStatus && styles.confirmButtonDisabled,
          ]}
          onPress={() => {
            if (selectedStatus) {
              onConfirm(selectedStatus);
            }
          }}
          disabled={!selectedStatus}
        >
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "100%", // 전체 너비의 85%
    height: height * 0.4, // 화면 높이의 50%로 세로 길이 확장

  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 26, // 헤더와 Picker 간 여백 증가
  },
  pickerWrapper: {
    width: "100%",
    backgroundColor: "#F7F9FA",
    borderRadius: 10,
    marginBottom: 32, // Picker와 버튼 간 여백 증가
    borderWidth: 1,
    borderColor: "#E8ECEF",
    height: Platform.OS === "ios" ? 200 : 150, // Picker 높이 확장
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 200 : 50, // iOS는 더 길게, Android는 드롭다운 스타일
    color: "#1A1A1A",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#006AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#E8ECEF",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E8ECEF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChangeStatusPicker;