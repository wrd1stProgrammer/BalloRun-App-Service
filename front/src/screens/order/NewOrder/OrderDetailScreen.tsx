import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { showOrderDetails } from "../../../redux/actions/orderAction";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { Ionicons } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

/* ------------------ nav types ------------------ */
type RootStackParamList = {
  OrderDetail: { orderId: string; orderType: string };
};
type OrderDetailRouteProp = RouteProp<RootStackParamList, "OrderDetail">;

/* ------------------ data model ------------------ */
interface OrderDetails {
  userId: string;
  name: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  riderRequest?: string;
  images?: string;
  orderImages?: string;
  lat: string;
  lng: string;
  deliveryMethod: string;
  pickupTime: Date;
  deliveryAddress: string;
  pickupTimeDisplay: string;
  status: string;
  isReservation: boolean;
  riderId?: string;
  createdAt: Date;
  endTime?: Date;
  usedPoints?: number;
  resolvedAddress?: string;
}

/* ================================================== */
const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId, orderType } = route.params;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState<"request" | "address">("request");
  const [viewerVisible, setViewerVisible] = useState(false);

  const dispatch = useAppDispatch();

  /* ---------- status 텍스트 ---------- */
  const getStatusMessage = (s: string) =>
    ({
      pending: "수락 대기 중",
      goToCafe: "구매장소 이동 중",
      makingMenu: "메뉴 준비 중",
      goToClient: "배달 중",
      delivered: "배달 완료",
      cancelled: "주문 취소됨",
    }[s] || "진행 중");

  /* ---------- data fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(showOrderDetails(orderId, orderType));
        setOrder(data);
      } catch (e) {
        console.error("fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, orderType]);

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </SafeAreaView>
    );
  }
  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>주문 정보를 불러올 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  /* ---------- 금액 계산 ---------- */
  const total = order.priceOffer + order.deliveryFee;
  const finalAmt = total - (order.usedPoints || 0);

  /* ---------- 이미지 배열 ---------- */
  const requestImg = order.images ? [{ uri: order.images }] : [];
  const addressImg = order.orderImages ? [{ uri: order.orderImages }] : [];
  const viewingImages = selectedTab === "request" ? requestImg : addressImg;

  /* ================================================== */
  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={isSmallScreen ? 24 : 26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
      </View>

      {/* ---------- content ---------- */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* ----- 가맹점 / 상태 ----- */}
        <View style={styles.section}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{order.name}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{getStatusMessage(order.status)}</Text>
            </View>
          </View>
        </View>

        {/* ----- 결제 정보 ----- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 정보</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>최종 결제 금액</Text>
            <Text style={styles.finalAmount}>₩{finalAmt.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentDetails}>
            <Row label="상품 금액" value={order.priceOffer} />
            <Row label="배달비" value={order.deliveryFee} />
            {order.usedPoints ? (
              <>
                <Row label="포인트 할인" value={-order.usedPoints} isDiscount />
                <Row label="원래 금액" value={total} isStriked />
              </>
            ) : null}
          </View>
        </View>

        {/* ----- 요청 내용 ----- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청 내용</Text>
          <Text style={styles.orderDetails}>{order.orderDetails}</Text>
        </View>

        {/* ----- 배달 정보 ----- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배달 정보</Text>
          <Info label="주소" value={order.resolvedAddress} />
          <Info label="상세 주소" value={order.deliveryAddress} />
          <Info label="요청 시간" value={new Date(order.createdAt).toLocaleString()} />
          {order.endTime && <Info label="요청 종료" value={new Date(order.endTime).toLocaleString()} />}
          <Info label="픽업 시간" value={order.pickupTimeDisplay} />
          <Info
            label="배달 방식"
            value={order.deliveryMethod === "direct" ? "직접 전달" : "비대면"}
          />
        </View>

        {/* ----- 이미지 탭 ----- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이미지</Text>
          <View style={styles.imageButtonsContainer}>
            <TabButton
              active={selectedTab === "request"}
              label="요청 사진"
              onPress={() => setSelectedTab("request")}
            />
            <TabButton
              active={selectedTab === "address"}
              label="상세 주소 사진"
              onPress={() => setSelectedTab("address")}
            />
          </View>

          {/* 이미지 썸네일 */}
          <TouchableOpacity
            style={styles.imageWrapper}
            activeOpacity={0.9}
            onPress={() => viewingImages.length && setViewerVisible(true)}
          >
            {viewingImages.length ? (
              <Image source={viewingImages[0]} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.emptyImageContainer}>
                <Text style={styles.emptyImageText}>이미지가 없습니다</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- 이미지 뷰어 ---------- */}
      <ImageViewing
        images={viewingImages}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        presentationStyle="fullScreen"
      />
    </SafeAreaView>
  );
};

/* ======================= 재사용 컴포넌트 ======================= */
const Row = ({
  label,
  value,
  isDiscount,
  isStriked,
}: {
  label: string;
  value: number;
  isDiscount?: boolean;
  isStriked?: boolean;
}) => (
  <View style={styles.paymentDetailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[
        styles.detailValue,
        isDiscount && styles.discountValue,
        isStriked && styles.originalValue,
      ]}
    >
      {isDiscount ? "-" : ""}
      ₩{value.toLocaleString()}
    </Text>
  </View>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const TabButton = ({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.imageButton, active && styles.activeImageButton]}
    onPress={onPress}
  >
    <Text style={[styles.imageButtonText, active && styles.activeImageButtonText]}>{label}</Text>
  </TouchableOpacity>
);

/* ======================= Styles ======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
  },
  backButton: { padding: 6, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginLeft: 12 },

  scrollContainer: { paddingHorizontal: 16, paddingVertical: 16 },

  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  /* store / status */
  storeInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  storeName: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  statusContainer: { backgroundColor: "#E6F0FF", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  status: { fontSize: 13, fontWeight: "600", color: "#006AFF" },

  /* 결제 */
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 12 },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F7F9FA",
    borderRadius: 8,
    padding: 12,
  },
  paymentLabel: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  finalAmount: { fontSize: 18, fontWeight: "700", color: "#006AFF" },
  paymentDetails: { paddingLeft: 8 },
  paymentDetailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  detailLabel: { fontSize: 13, color: "#6B7280" },
  detailValue: { fontSize: 13, color: "#1A1A1A", fontWeight: "500" },
  discountValue: { color: "#00A86B" },
  originalValue: { textDecorationLine: "line-through", color: "#8E9199" },

  /* 요청 */
  orderDetails: { fontSize: 15, color: "#1A1A1A", lineHeight: 22 },

  /* 배달 정보 */
  infoRow: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "500", color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 15, color: "#1A1A1A", lineHeight: 20 },

  /* 이미지 탭 */
  imageButtonsContainer: { flexDirection: "row", gap: 8, marginBottom: 12 },
  imageButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
  },
  activeImageButton: { backgroundColor: "#006AFF" },
  imageButtonText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  activeImageButtonText: { color: "#FFF" },

  /* 이미지 썸네일 */
  imageWrapper: { width: "100%", borderRadius: 10, overflow: "hidden" },
  image: { width: "100%", height: 220, backgroundColor: "#FFF" },
  emptyImageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageText: { fontSize: 16, color: "#6B7280", fontWeight: "500" },

  /* load / error */
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F9FA" },
  loadingText: { fontSize: 14, color: "#6B7280", marginTop: 10 },
  errorText: { fontSize: 16, color: "#FF3B30", textAlign: "center", marginTop: 20 },
});
export default OrderDetailScreen;
