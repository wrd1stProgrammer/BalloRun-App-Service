/**
 * DeliveryDetailBottomSheet.tsx
 * - Draggable bottom sheet (full ↔ peek)
 * - Image viewer (react-native-image-viewing)
 * - Safe-area 대응
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ImageViewing from "react-native-image-viewing";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const { width, height: SCREEN_H } = Dimensions.get("window");

/* -------------------------------------------------------------------------- */
/*                                   types                                    */
/* -------------------------------------------------------------------------- */
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
  riderRequest: string;
  images: string;
  orderImages: string;
  selectedFloor: string;
};

type Props = {
  deliveryItem: DeliveryItem;
  onAccept?: () => void;
  distance?: number;
};

/* -------------------------------------------------------------------------- */
/*                          helpers (마감 시간 계산)                          */
/* -------------------------------------------------------------------------- */
const getTimeRemaining = (end: string) => {
  const now = new Date();
  const dead = new Date(end);
  const diff = dead.getTime() - now.getTime();
  if (diff <= 0) return "마감됨";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}시간 ${m}분 남음`;
};

/* ----------------------- Snap positions (y-offset) ----------------------- */
const SNAP = {
  FULL: 0, // 완전 펼침 (시트 상단이 화면 하단과 맞닿음)
  PEEK: 365, // 잠깐 내린 상태
};

/* -------------------------------------------------------------------------- */
/*                         DeliveryDetailBottomSheet                          */
/* -------------------------------------------------------------------------- */
export default function DeliveryDetailBottomSheet({
  deliveryItem,
  onAccept,
  distance,
}: Props) {
  const insets = useSafeAreaInsets();
  const [viewerVisible, setViewerVisible] = useState(false);

  /* 주문 이미지 배열 */
  const images = deliveryItem.images
    ? deliveryItem.images.split(",").map((u) => ({ uri: u.trim() }))
    : [];

  /* ----------------------- Reanimated 공유 값 ----------------------- */
  const translateY = useSharedValue(SNAP.FULL);

  /* ------------------------- 제스처 정의 ------------------------- */
  const onGestureEvent = (e: PanGestureHandlerGestureEvent) => {
    const { translationY } = e.nativeEvent;
    translateY.value = Math.max(
      SNAP.FULL,
      translateY.value + translationY
    );
  };

  const onHandlerStateChange = (_: PanGestureHandlerGestureEvent) => {
    const dest =
      translateY.value < SNAP.PEEK ? SNAP.FULL : SNAP.PEEK;
    translateY.value = withSpring(dest, { 
      damping: 25,            // `↑`값이 크면 감쇠가 커져 덜 튐   (기본 10)
      stiffness: 200,         // `↓`값이 작으면 텐션이 느슨해짐    (기본 100)
      mass: 1.3,              // 관성 조절 (기본 1)
      overshootClamping: true // 목표 지점을 넘어가지 않고 딱 멈춤
     });
  };

  /* ---------------------- Animated Style ---------------------- */
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  /* ------------------------------------------------------------------ */
  /*                              Render                                */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ===== 바텀시트 ===== */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onEnded={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            sheetStyle,
            { paddingBottom: insets.bottom + 5 },
          ]}
        >
          {/* ───────── Handle Bar ───────── */}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.handle}
            onPress={() =>
              (translateY.value = withSpring(
                translateY.value === SNAP.FULL ? SNAP.PEEK : SNAP.FULL,
                { damping: 18 }
              ))
            }
          />

          {/* ============ Header ============ */}
          <View style={styles.header}>
            <View style={styles.tagChip}>
              <Ionicons
                name={
                  deliveryItem.deliveryType === "direct" ? "walk" : "cube"
                }
                size={14}
                color="#3384FF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.tagText}>
                {deliveryItem.deliveryType === "direct"
                  ? "직접 전달"
                  : "보관함"}
              </Text>
            </View>

            <Text style={styles.cafeName}>
              {deliveryItem.items[0]?.cafeName}
            </Text>

            <View style={styles.metaRow}>
              <Ionicons name="cash-outline" size={18} color="#667085" />
              <Text style={styles.metaText}>
                {deliveryItem.deliveryFee.toLocaleString()}원
              </Text>
              <Ionicons
                name="location-outline"
                size={18}
                color="#667085"
                style={{ marginLeft: 12 }}
              />
              <Text style={styles.metaText}>
                {distance ? (distance / 1000).toFixed(1) : "-"} km
              </Text>
            </View>
          </View>

          {/* ============ Info Card ============ */}
          <View style={styles.card}>
            {[
              {
                icon: "receipt-outline",
                label: "상세 요청 주문내용",
                value: deliveryItem.items?.[0]?.menuName ?? "메뉴 없음",
              },
              {
                icon: "pin-outline",
                label: "배달 주소",
                value: deliveryItem.resolvedAddress,
              },
              {
                icon: "pricetag-outline",
                label: "예약 주문",
                value: deliveryItem.isReservation ? "O" : "X",
              },
              {
                icon: "time-outline",
                label: "마감까지",
                value: getTimeRemaining(deliveryItem.endTime),
              },
              {
                icon: "people-outline",
                label: "라이더에게 요청",
                value: deliveryItem.riderRequest || "없음",
              },
              deliveryItem.deliveryType === "cupHolder" && {
                icon: "layers-outline",
                label: "보관함 층수",
                value: deliveryItem.selectedFloor || "정보 없음",
              },
            ]
              .filter(Boolean)
              .map((row, idx, arr) => (
                <View
                  key={idx}
                  style={[
                    styles.infoRow,
                    idx !== arr.length - 1 && { borderBottomWidth: 0.6 },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons
                      name={row.icon as any}
                      size={16}
                      color="#667085"
                    />
                    <Text style={styles.rowLabel}>{row.label}</Text>
                  </View>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              ))}

            {/* ---- 이미지 보기 ---- */}
            {images.length > 0 && (
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={() => setViewerVisible(true)}
              >
                <Ionicons name="images-outline" size={18} color="#3384FF" />
                <Text style={styles.imageBtnText}>
                  상세 주문 이미지 ({images.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ============ 수락 버튼 ============ */}
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.acceptText}>주문 수락</Text>
          </TouchableOpacity>

          {/* ============ 이미지 뷰어 ============ */}
          <ImageViewing
            images={images}
            visible={viewerVisible}
            onRequestClose={() => setViewerVisible(false)}
            presentationStyle="fullScreen"
          />
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 12,
  },
  handle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D0D5DD",
    marginBottom: 8,
  },

  /* ---------- Header ---------- */
  header: { marginBottom: 14 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E6F0FF",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagText: { fontSize: 12, color: "#3384FF", fontWeight: "600" },
  cafeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaText: { fontSize: 14, color: "#475467", marginLeft: 4 },

  /* ---------- Card ---------- */
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: "#E4E7EC",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowLabel: { fontSize: 14, color: "#667085", marginLeft: 6 },
  rowValue: {
    maxWidth: "60%",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "right",
  },

  /* ---------- 이미지 버튼 ---------- */
  imageBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  imageBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3384FF",
    marginLeft: 6,
  },

  /* ---------- 수락 버튼 ---------- */
  acceptBtn: {
    backgroundColor: "#3384FF",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 17,
  },
  acceptText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
