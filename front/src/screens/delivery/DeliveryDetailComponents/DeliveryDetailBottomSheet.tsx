import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  deliveryFee: number;
};

type Props = {
  deliveryItem: DeliveryItem;
  onAccept?: () => void;
  onReject?: () => void;
};

const DeliveryDetailBottomSheet: React.FC<Props> = ({ deliveryItem, onAccept, onReject }) => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.tag}>일반</Text>
        <Text style={styles.shop}>{deliveryItem.items[0]?.cafeName}</Text>
        <Text style={styles.fee}>{deliveryItem.deliveryFee.toLocaleString()}원</Text>
        <Text style={styles.distance}>배달거리 0.5km (설정값)</Text>
        <Text style={styles.info}>* 일부 매장의 조리 완료 시간은 과거 배달 기록으로 계산됩니다.</Text>
        <Text style={styles.missions}>진행되는 미션 <Text style={styles.highlight}>4개</Text></Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.reject} onPress={onReject}>
          <Text style={styles.rejectText}>거절</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.accept, seconds <= 0 && styles.disabled]}
          onPress={onAccept}
          disabled={seconds <= 0}
        >
          <Text style={styles.acceptText}>주문 수락 | {seconds}초</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryDetailBottomSheet;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  top: {
    marginBottom: 16,
  },
  tag: {
    fontSize: 12,
    color: "#006AFF",
    backgroundColor: "#E6F0FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  shop: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  fee: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  info: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  missions: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  highlight: {
    fontWeight: "bold",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  reject: {
    flex: 1,
    backgroundColor: "#E8ECEF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  rejectText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  accept: {
    flex: 1,
    backgroundColor: "#006AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  acceptText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  disabled: {
    backgroundColor: "#A5C8FF",
  },
});