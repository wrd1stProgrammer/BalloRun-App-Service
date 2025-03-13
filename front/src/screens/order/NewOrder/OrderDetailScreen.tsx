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
  Platform,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { showOrderDetails } from "../../../redux/actions/orderAction";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 360; // 작은 화면 기준 (예: iPhone SE)

type RootStackParamList = {
  OrderDetail: {
    orderId: string;
    orderType: string;
  };
};

type OrderDetailRouteProp = RouteProp<RootStackParamList, "OrderDetail">;

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
  deliveryType: string;
  pickupTime: Date;
  deliveryAddress: string;
  pickupTimeDisplay: string;
  status: string;
  isReservation: boolean;
  riderId?: string;
  createdAt: Date;
  usedPoints?: number;
}

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId, orderType } = route.params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  // status를 한글로 변환하는 함수
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "수락 대기 중";
      case "goToCafe":
        return "카페로 이동 중";
      case "makingMenu":
        return "메뉴 준비 중";
      case "goToClient":
        return "배달 중";
      case "delivered":
        return "배달 완료";
      case "cancelled":
        return "주문 취소됨";
      default:
        return "진행 중";
    }
  };

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const data = await dispatch(showOrderDetails(orderId, orderType));
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, orderType]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006AFF" />
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

  const totalAmount = order.priceOffer + order.deliveryFee;
  const finalAmount = totalAmount - (order.usedPoints || 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={isSmallScreen ? 24 : 26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 가게 정보 및 상태 */}
        <View style={styles.section}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{order.name}</Text>
            <Text style={styles.status}>{getStatusMessage(order.status)}</Text>
          </View>
          <Text style={styles.orderType}>{orderType}</Text>
        </View>

        {/* 결제 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 정보</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>최종 결제 금액</Text>
            <Text style={styles.finalAmount}>₩{finalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.detailLabel}>상품 금액</Text>
              <Text style={styles.detailValue}>₩{order.priceOffer.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.detailLabel}>배달비</Text>
              <Text style={styles.detailValue}>₩{order.deliveryFee.toLocaleString()}</Text>
            </View>
            {order.usedPoints > 0 && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.detailLabel}>포인트 할인</Text>
                <Text style={styles.discountValue}>-₩{order.usedPoints.toLocaleString()}</Text>
              </View>
            )}
            {order.usedPoints > 0 && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.detailLabel}>원래 금액</Text>
                <Text style={styles.originalValue}>₩{totalAmount.toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 요청 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요청 내용</Text>
          <Text style={styles.orderDetails}>{order.orderDetails}</Text>
        </View>

        {/* 배달 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배달 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>주소</Text>
            <Text style={styles.value}>{order.deliveryAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>시간</Text>
            <Text style={styles.value}>{order.pickupTimeDisplay}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>배달 방식</Text>
            <Text style={styles.value}>{order.deliveryType === "direct" ? "직접 전달" : "비대면"}</Text>
          </View>
        </View>

        {/* 이미지 */}
        {(order.images || order.orderImages) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이미지</Text>
            <View style={styles.imageContainer}>
              {order.images && (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: order.images }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageLabel}>상품</Text>
                </View>
              )}
              {order.orderImages && (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: order.orderImages }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageLabel}>픽업 위치</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA", // 토스 스타일 연한 회색 배경
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: Platform.OS === "ios" ? 12 : 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    //backgroundColor: "#F0F2F5", // 터치 피드백 배경
  },
  headerTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 12,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    paddingBottom: height * 0.05,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  storeName: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  status: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: "600",
    color: "#006AFF",
  },
  orderType: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E9199",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  finalAmount: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: "700",
    color: "#006AFF",
  },
  paymentDetails: {
    paddingLeft: width * 0.03,
  },
  paymentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#1A1A1A",
  },
  discountValue: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#00A86B",
  },
  originalValue: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E9199",
    textDecorationLine: "line-through",
  },
  orderDetails: {
    fontSize: isSmallScreen ? 14 : 15,
    color: "#1A1A1A",
    lineHeight: isSmallScreen ? 20 : 22,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: isSmallScreen ? 12 : 13,
    fontWeight: "500",
    color: "#6B7280",
    width: "30%",
  },
  value: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#1A1A1A",
    flex: 1,
    textAlign: "right",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: width * 0.03,
  },
  imageWrapper: {
    alignItems: "center",
    width: width * 0.4,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: width * 0.4,
    borderRadius: 10,
    backgroundColor: "#E8ECEF",
  },
  imageLabel: {
    fontSize: isSmallScreen ? 10 : 11,
    color: "#6B7280",
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FA",
  },
  loadingText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: "#6B7280",
    marginTop: 10,
  },
  errorText: {
    fontSize: isSmallScreen ? 15 : 16,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 20,
  },
});

export default OrderDetailScreen;