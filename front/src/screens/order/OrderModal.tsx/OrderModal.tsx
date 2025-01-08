import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modalize } from "react-native-modalize";

// Props 인터페이스 정의
interface OrderModalProps {
  modalRef: React.RefObject<Modalize>;
  height: number;
}

const OrderModal: React.FC<OrderModalProps> = ({ modalRef, height }) => {
  return (
    <Modalize
      ref={modalRef}
      snapPoint={height * 0.5}
      modalHeight={height * 0.8}
      handleStyle={styles.handle}
      modalStyle={styles.modal}
      onClose={() => {
        console.log("Modal closed");
      }}
    >
      <View style={styles.modalContent}>
        <Text style={styles.label}>배달 상세 주소</Text>
        <View style={styles.inputBox}>
          <Text>A1융합대학 3층 301호</Text>
        </View>
        <Text style={styles.label}>배달 요청 시간</Text>
        <View style={styles.timeOptions}>
          <Text style={styles.timeOption}>3시 30분</Text>
          <Text style={styles.timeOption}>4시 30분</Text>
        </View>
        <Text style={styles.label}>금액 설정</Text>
        <View style={styles.inputBox}>
          <Text>1000원</Text>
        </View>
        <Text style={styles.label}>옵션</Text>
        <View style={styles.optionButtons}>
          <Text style={styles.optionButton}>직접배달</Text>
          <Text style={styles.optionButton}>음료보관대</Text>
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
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
});

export default OrderModal;
