import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type DeliveryItem = {
    _id: string;
    items: { menuName: string; quantity: number; cafeName: string }[];
    address: string;
    deliveryType: "direct" | "cupholder" | any;
    startTime: string;
    deliveryFee: number;
    price: number;
    cafeLogo: string;
    createdAt: string;
    endTime: string;
    lat: string;
    lng: string;
    isReservation: boolean;
    orderType: "Order" | "NewOrder"; 
    orderDetails: string;
    images: string;
    orderImages: string;
};

type DeliveryDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  deliveryItem: DeliveryItem | null;
};

const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({ visible, onClose, onAccept, deliveryItem }) => {
  if (!deliveryItem) return null;
  console.log(deliveryItem.items)
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>배달 상세 정보</Text>
          <Text style={styles.cafeName}>{deliveryItem.items[0].cafeName}</Text>
          <Text style={styles.menu}>
            {deliveryItem.items.map((i) => `${i.menuName} x${i.quantity}`).join(", ")}
          </Text>
          <Text style={styles.info}>주소: {deliveryItem.address}</Text>
          <Text style={styles.info}>배달 유형: {deliveryItem.deliveryType === "direct" ? "직접 배달" : "컵홀더 배달"}</Text>
          <Text style={styles.info}>배달비: {deliveryItem.deliveryFee}원</Text>
          <Text style={styles.info}>총 가격: {deliveryItem.price}원</Text>
          <Text style={styles.info}>주문 생성 시간: {new Date(deliveryItem.createdAt).toLocaleTimeString()}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.buttonText}>배달하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveryDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  menu: {
    fontSize: 14,
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
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