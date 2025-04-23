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
const isSmallScreen = width < 360;

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
  deliveryMethod: string;
  pickupTime: Date;
  deliveryAddress: string;
  pickupTimeDisplay: string;
  status: string;
  isReservation: boolean;
  riderId?: string;
  createdAt: Date;        // Changed to 요청시간
  endTime?: Date;         // Added 요청 종료시간
  usedPoints?: number;
  resolvedAddress?: string;
}

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation();
  const { orderId, orderType } = route.params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageType, setSelectedImageType] = useState<"request" | "address" | null>(null);
  const dispatch = useAppDispatch();

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending": return "수락 대기 중";
      case "goToCafe": return "카페로 이동 중";
      case "makingMenu": return "메뉴 준비 중";
      case "goToClient": return "배달 중";
      case "delivered": return "배달 완료";
      case "cancelled": return "주문 취소됨";
      default: return "진행 중";
    }
  };

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const data = await dispatch(showOrderDetails(orderId, orderType));
        setOrder(data);
        setSelectedImageType(data?.images ? "request" : "address");
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
        <ActivityIndicator size="large" color="#000" />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={isSmallScreen ? 24 : 26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
      </View>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.storeInfo}>
                <View>
                  <Text style={styles.storeName}>{order.name}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={styles.status}>{getStatusMessage(order.status)}</Text>
                </View>
              </View>
            </View>

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
                  <>
                    <View style={styles.paymentDetailRow}>
                      <Text style={styles.detailLabel}>포인트 할인</Text>
                      <Text style={styles.discountValue}>-₩{order.usedPoints.toLocaleString()}</Text>
                    </View>
                    <View style={styles.paymentDetailRow}>
                      <Text style={styles.detailLabel}>원래 금액</Text>
                      <Text style={styles.originalValue}>₩{totalAmount.toLocaleString()}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>요청 내용</Text>
              <Text style={styles.orderDetails}>{order.orderDetails}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>배달 정보</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>주소</Text>
                <Text style={styles.value}>{order.resolvedAddress}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>상세 주소</Text>
                <Text style={styles.value}>{order.deliveryAddress}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>요청 시간</Text>
                <Text style={styles.value}>{new Date(order.createdAt).toLocaleString()}</Text>
              </View>
              {order.endTime && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>요청 종료 시간</Text>
                  <Text style={styles.value}>{new Date(order.endTime).toLocaleString()}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.label}>픽업 시간</Text>
                <Text style={styles.value}>{order.pickupTimeDisplay}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>배달 방식</Text>
                <Text style={styles.value}>
                  {order.deliveryMethod === "direct" ? "직접 전달" : "비대면"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>이미지</Text>
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.imageButton,
                    selectedImageType === "request" && styles.activeImageButton,
                  ]}
                  onPress={() => setSelectedImageType("request")}>
                  <Text
                    style={[
                      styles.imageButtonText,
                      selectedImageType === "request" && styles.activeImageButtonText,
                    ]}>
                    요청 사진
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.imageButton,
                    selectedImageType === "address" && styles.activeImageButton,
                  ]}
                  onPress={() => setSelectedImageType("address")}>
                  <Text
                    style={[
                      styles.imageButtonText,
                      selectedImageType === "address" && styles.activeImageButtonText,
                    ]}>
                    상세 주소 사진
                  </Text>
                </TouchableOpacity>
              </View>
              
              {selectedImageType === "request" && (
                <View style={styles.imageWrapper}>
                  {order.images ? (
                    <Image
                      source={{ uri: order.images }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.emptyImageContainer}>
                      <Text style={styles.emptyImageText}>이미지가 없습니다</Text>
                    </View>
                  )}
                </View>
              )}
              
              {selectedImageType === "address" && (
                <View style={styles.imageWrapper}>
                  {order.orderImages ? (
                    <Image
                      source={{ uri: order.orderImages }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.emptyImageContainer}>
                      <Text style={styles.emptyImageText}>이미지가 없습니다</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  storeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderType: {
    fontSize: 13,
    color: "#8E9199",
    fontWeight: "500",
  },
  statusContainer: {
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    color: "#006AFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F7F9FA",
    borderRadius: 8,
    padding: 12,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#006AFF",
  },
  paymentDetails: {
    paddingLeft: 8,
  },
  paymentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 13,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  discountValue: {
    fontSize: 13,
    color: "#00A86B",
  },
  originalValue: {
    fontSize: 13,
    color: "#8E9199",
    textDecorationLine: "line-through",
  },
  orderDetails: {
    fontSize: 15,
    color: "#1A1A1A",
    lineHeight: 22,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  imageButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
  },
  activeImageButton: {
    backgroundColor: "#006AFF",
  },
  imageButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeImageButtonText: {
    color: "#FFFFFF",
  },
  imageWrapper: {
    width: "100%",
    marginBottom: 10,
    
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  imageLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FA",
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 20,
  },
  emptyImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageText: {
    fontSize: 16,
    color: "#6B7280",
    backgroundColor: "#FFFFFF",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8ECEF",
  },
});

export default OrderDetailScreen;