import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";

type OrderDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  deliveryItem: any;
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, onClose, onAccept, deliveryItem }) => {
  if (!deliveryItem) return null;
  console.log(deliveryItem);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.header}>배달 상세 정보</Text>

            {/* 카페 및 메뉴 정보 */}
            <Text style={styles.info}>가게 이름: {deliveryItem.items[0]?.cafeName || "없음"}</Text>
            <Text style={styles.info}>메뉴: {deliveryItem.items.map(i => `${i.menuName} x${i.quantity}`).join(", ") || "없음"}</Text>
            <Text style={styles.info}>설명: {deliveryItem.items[0]?.description || "없음"}</Text>
            <Text style={styles.info}>
                {deliveryItem.items.map(i => {
                    const requiredOption = i.RequiredOption ? `필수옵션: ${i.RequiredOption}` : "";
                    const additionalOptions = i.AdditionalOptions?.length
                        ? `추가옵션: ${i.AdditionalOptions.map(opt => opt).join(", ")}`
                        : "";

                    return `${i.menuName} (${[requiredOption, additionalOptions].filter(Boolean).join(", ")})`;
                }).join("\n")}
            </Text>


            {/* 배달 정보 */}
            <Text style={styles.info}>위치: {deliveryItem.lat}, {deliveryItem.lng}</Text>
            <Text style={styles.info}>배달 유형: {deliveryItem.deliveryType === "direct" ? "직접 배달" : "기타"}</Text>
            <Text style={styles.info}>배달비: {deliveryItem.deliveryFee}원</Text>
            <Text style={styles.info}>총 가격: {deliveryItem.price || 0}원</Text>
            <Text style={styles.info}>라이더 요청사항: {deliveryItem.riderRequest || "없음"}</Text>



            {/* 주문 시간 */}
            <Text style={styles.info}>주문 요청 시간: {new Date(deliveryItem.startTime).toLocaleTimeString()}</Text>
            <Text style={styles.info}>
              종료: {
                (() => {
                  const now = new Date();
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

            {/* 이미지 표시 (메뉴 이미지) */}
            {deliveryItem.selectedImageUri && (
              <Image source={{ uri: deliveryItem.selectedImageUri }} style={styles.image} />
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

export default OrderDetailModal;

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