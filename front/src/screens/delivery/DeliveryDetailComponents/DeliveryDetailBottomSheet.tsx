import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type DeliveryItem = {
  _id: string;
  name: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupHolder";
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder";
};

type Props = {
  deliveryItem: DeliveryItem;
  onAccept?: () => void;
  onReject?: () => void;
  distance?: number;
};

const DeliveryDetailBottomSheet: React.FC<Props> = ({ deliveryItem, onAccept, onReject, distance }) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.tag}>{deliveryItem.deliveryType}</Text>
        <Text style={styles.shop}>{deliveryItem.items[0]?.cafeName}</Text>
        <Text style={styles.fee}>{deliveryItem.deliveryFee.toLocaleString()}원</Text>
        <Text style={styles.distance}>배달거리 {distance ? (distance / 1000).toFixed(1) : '-'}km</Text>
        <Text style={styles.info}>* 일부 매장의 조리 완료 시간은 과거 배달 기록으로 계산됩니다.</Text>
      </View>
      {/* Delivery details for decision */}
      <View style={{ marginBottom: 20 }}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>주문종류</Text>
          <Text style={styles.value}>{deliveryItem.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>배달 주소</Text>
          <Text style={styles.value}>{deliveryItem.resolvedAddress}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>배달 유형</Text>
          <Text style={styles.value}>{deliveryItem.deliveryType === 'direct' ? '직접 전달' : '컵홀더 사용'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>예약 주문</Text>
          <Text style={styles.value}>{deliveryItem.isReservation ? '예' : '아니오'}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.accept, { flex: 1 }]}
          onPress={onAccept}
        >
          <Text style={styles.acceptText}>주문 수락</Text>
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
    // Single button full width
    justifyContent: "center",
    gap: 0,
  },
  accept: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});