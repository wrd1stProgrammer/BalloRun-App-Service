import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

interface NoticeTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const NoticeTimePicker: React.FC<NoticeTimePickerProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>배달 예약이란?</Text>
          <Text style={styles.description}>
            배달 예약을 선택하면 원하는 시간에 맞춰 배달이 진행됩니다.{"\n"}
            현재 시간보다 이후의 시간으로 설정해야 합니다.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoticeTimePicker;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  cancelText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#8A67F8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  confirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});