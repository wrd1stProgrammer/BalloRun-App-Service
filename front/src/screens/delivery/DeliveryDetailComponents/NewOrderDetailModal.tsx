import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";

type NewOrderDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  deliveryItem: any;
};

const NewOrderDetailModal: React.FC<NewOrderDetailModalProps> = ({ visible, onClose, onAccept, deliveryItem }) => {
  if (!deliveryItem) return null;
  console.log(deliveryItem);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.header}>새로운 주문 상세</Text>

            {/* 주문 정보 */}
            <Text style={styles.info}>가게 이름: {deliveryItem.items[0]?.cafeName || "없음"}</Text>
            <Text style={styles.info}>주문 메뉴: {deliveryItem.items[0]?.menuName || "없음"}</Text>
            <Text style={styles.info}>배달 주소: {deliveryItem.resolvedAddress}</Text>
            <Text style={styles.info}>배달 유형: {deliveryItem.deliveryType === "direct" ? "직접 배달" : "비대면 배달"}</Text>
            <Text style={styles.info}>배달비: {deliveryItem.deliveryFee}원</Text>
            <Text style={styles.info}>총 주문 가격: {deliveryItem.price}원</Text>
            <Text style={styles.info}>배달자 주문 요청사항: {deliveryItem.riderRequest}</Text>

            <Text style={styles.info}>주문 요청 시간: {new Date(deliveryItem.startTime).toLocaleTimeString()}</Text>
            <Text style={styles.info}>
              주문 종료 시간: {
                (() => {
                  const now = new Date(deliveryItem.startTime);
                  const endTime = new Date(deliveryItem.endTime);
                  const diff = endTime - now; // 밀리초 차이

                  if (diff <= 0) return "종료됨"; // 이미 종료된 경우

                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                  return `${hours}시간 ${minutes}분 ${seconds}초 남음`;
                })()
              }
            </Text>            
            {/* 상태 표시 */}
            <Text style={[styles.info, { color: deliveryItem.status === "cancelled" ? "red" : "green" }]}>
              상태: {deliveryItem.status === "cancelled" ? "취소됨" : "대기 중"}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                <Text style={styles.buttonText}>배달하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NewOrderDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#bbb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});