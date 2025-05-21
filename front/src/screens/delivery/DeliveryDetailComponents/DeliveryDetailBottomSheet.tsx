import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from "react-native";

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
  riderRequest:string;
  images:string;
  orderImages:string;
  selectedFloor:string
};

type Props = {
  deliveryItem: DeliveryItem;
  onAccept?: () => void;
  onReject?: () => void;
  distance?: number;
};

const getTimeRemaining = (endTime: string) => {
  const now = new Date();
  const deadline = new Date(endTime);
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return '마감됨';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}시간 ${minutes}분 남음`;
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
          <Text style={styles.value}>{deliveryItem.deliveryType === 'direct' ? '직접 전달' : '보관함 사용'}</Text>
        </View>
        {deliveryItem.deliveryType === 'cupHolder' && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>보관함 층수</Text>
            <Text style={styles.value}>{deliveryItem.selectedFloor || '정보 없음'}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>예약 주문</Text>
          <Text style={styles.value}>{deliveryItem.isReservation ? 'O' : 'X'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>라이더 요청사항</Text>
          <Text style={styles.value}>{deliveryItem.riderRequest || '없음'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>마감까지</Text>
          <Text style={styles.value}>{getTimeRemaining(deliveryItem.endTime)}</Text>
        </View>
        {deliveryItem.orderImages && (
          <View style={{ marginVertical: 8 }}>
            <Text style={styles.label}>주문 이미지</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {deliveryItem.orderImages.split(',').map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img.trim() }}
                  style={{ width: 120, height: 120, borderRadius: 8, marginRight: 10 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  top: {
    marginBottom: 12,
  },
  tag: {
    fontSize: 12,
    color: "#006AFF",
    backgroundColor: "#E6F0FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  shop: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  fee: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  info: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
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
    marginBottom: 6,
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