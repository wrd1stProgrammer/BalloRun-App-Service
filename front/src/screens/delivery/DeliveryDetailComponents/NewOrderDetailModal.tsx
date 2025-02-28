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

  // 남은 시간 계산 함수
  const getRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(deliveryItem.endTime);
    const diff = endTime - now;

    if (diff <= 0) return "종료됨";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 남음`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.header}>주문 상세</Text>

            {/* 배달 상태 표시 */}
            <View style={[styles.statusBadge, deliveryItem.status === "cancelled" ? styles.statusCancelled : styles.statusActive]}>
              <Text style={styles.statusText}>{deliveryItem.status === "cancelled" ? "취소됨" : "대기 중"}</Text>
            </View>

            {/* 주문 정보 */}
            <View style={styles.section}>
              <Text style={styles.label}>가게 이름</Text>
              <Text style={styles.value}>{deliveryItem.items[0]?.cafeName || "없음"}</Text>

              <Text style={styles.label}>주문 메뉴</Text>
              <Text style={styles.value}>
                {deliveryItem.items.map(i => `${i.menuName} x${i.quantity}`).join(", ") || "없음"}
              </Text>

              <Text style={styles.label}>배달 주소</Text>
              <Text style={styles.value}>{deliveryItem.resolvedAddress}</Text>

              <Text style={styles.label}>배달 유형</Text>
              <Text style={styles.value}>{deliveryItem.deliveryType === "direct" ? "직접 배달" : "비대면 배달"}</Text>

              <Text style={styles.label}>배달비</Text>
              <Text style={styles.value}>{deliveryItem.deliveryFee}원</Text>

              <Text style={styles.label}>총 주문 가격</Text>
              <Text style={styles.value}>{deliveryItem.price}원</Text>

              <Text style={styles.label}>배달자 요청사항</Text>
              <Text style={styles.value}>{deliveryItem.riderRequest || "없음"}</Text>

              <Text style={styles.label}>배달 희망 시간</Text>
              <Text style={styles.value}>{new Date(deliveryItem.startTime).toLocaleTimeString()}부터</Text>

              <Text style={styles.label}>주문 종료 시간</Text>
              <Text style={styles.value}>{new Date(deliveryItem.endTime).toLocaleTimeString()}</Text>
            </View>

            {/* 남은 시간 */}
            <View style={styles.timeRemaining}>
              <Text style={styles.timeText}>{getRemainingTime()}</Text>
            </View>

            {/* 주문 이미지 섹션 (가로 스크롤) */}
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>주문 이미지</Text>
              {deliveryItem.selectedImageUris && deliveryItem.selectedImageUris.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                  {deliveryItem.selectedImageUris.map((uri: string, index: number) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>이미지가 없습니다</Text>
                </View>
              )}
            </View>

            {/* 버튼 컨테이너 */}
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
    borderRadius: 15,
    maxHeight: "85%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusActive: {
    backgroundColor: "#3366FF",
  },
  statusCancelled: {
    backgroundColor: "#CCCCCC",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  timeRemaining: {
    alignSelf: "center",
    backgroundColor: "#FFCC00",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  imageScroll: {
    flexDirection: "row",
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: "#3366FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#BBBBBB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});