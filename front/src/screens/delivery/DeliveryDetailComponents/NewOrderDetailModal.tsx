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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.header}>새로운 주문 상세</Text>
            
            {/* 주문 내용 */}
            <Text style={styles.info}>주문 내용: {deliveryItem.orderDetails}</Text>
            <Text style={styles.info}>배달 주소: {deliveryItem.deliveryAddress}</Text>
            <Text style={styles.info}>픽업 시간: {deliveryItem.pickupTimeDisplay}</Text>
            <Text style={styles.info}>배달 요청사항: {deliveryItem.riderRequest || "없음"}</Text>
            <Text style={styles.info}>배달 유형: {deliveryItem.deliveryType === "direct" ? "직접 배달" : "기타"}</Text>
            <Text style={styles.info}>배달비: {deliveryItem.deliveryFee}원</Text>
            <Text style={styles.info}>총 가격: {deliveryItem.priceOffer}원</Text>
            <Text style={[styles.info, { color: deliveryItem.status === "cancelled" ? "red" : "green" }]}>
              상태: {deliveryItem.status === "cancelled" ? "취소됨" : "대기 중"}
            </Text>

            {/* 주문 이미지 표시 */}
            {deliveryItem.orderImages && (
              <Image source={{ uri: deliveryItem.orderImages }} style={styles.image} />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
              {deliveryItem.status !== "cancelled" && (
                <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                  <Text style={styles.buttonText}>배달하기</Text>
                </TouchableOpacity>
              )}
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
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
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