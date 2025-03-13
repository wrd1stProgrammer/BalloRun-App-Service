import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import { getDeliveryListHandler } from "../../../redux/actions/orderAction";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import { navigate } from "../../../navigation/NavigationUtils";
import Icon from "react-native-vector-icons/MaterialIcons";
import ChangeStatusPicker from "./DeliveryListComponents.tsx/ChangeStatusPicker";
import { completeOrderHandler, goToCafeHandler, goToClientHandler, makingMenuHandler } from "../../../redux/actions/riderAction";
import { clearOngoingOrder, setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { useLocation } from "../../../utils/Geolocation/LocationContext";
import { refetchUser } from "../../../redux/actions/userAction";

interface OrderItem {
  _id: string;
  userId: string;
  items: { cafeName: string; menuName: string }[];
  lat: string;
  lng: string;
  deliveryType: string;
  status: string;
  startTime: string;
  deliveryFee: number;
  createdAt: number;
  riderRequest: string;
  endTime: string;
  selectedFloor: null | string;
  updatedAt: string;
  orderType: string;
  riderId: string;
}

interface OrderListProps {
  activeTab: "orders" | "deliveries";
}

const DeliveryList: React.FC<OrderListProps> = ({ activeTab }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]); // 원본 데이터 저장
  const [filterTab, setFilterTab] = useState("inProgress");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const orderSocket = useContext(WebSocketContext);
  const navigation = useNavigation();
  const { location, startTracking, stopTracking } = useLocation();

  const fetchOrders = async () => {
    try {
      const response = await dispatch(getDeliveryListHandler());
      const sortedOrders = response.sort(
        (a: OrderItem, b: OrderItem) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setAllOrders(sortedOrders); // 원본 데이터 저장
      // 필터링된 데이터 설정
      if (filterTab === "inProgress") {
        setOrders(
          sortedOrders.filter(
            (item) => item.status !== "delivered" && item.status !== "cancelled"
          )
        );
      } else {
        setOrders(
          sortedOrders.filter(
            (item) => item.status === "delivered" || item.status === "cancelled"
          )
        );
      }
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "deliveries") {
      socket?.on("emitMatchTest", fetchOrders);
      fetchOrders();
      return () => {
        fetchOrders();
        socket?.off("emitMatchTest");
      };
    } else {
      console.log("나의 주문 목록 보기가 아님");
    }
  }, [navigation, socket, activeTab]);

  const filterOrders = (type: string) => {
    setFilterTab(type);
    if (type === "inProgress") {
      setOrders(
        allOrders.filter(
          (item) => item.status !== "delivered" && item.status !== "cancelled"
        )
      );
    } else {
      setOrders(
        allOrders.filter(
          (item) => item.status === "delivered" || item.status === "cancelled"
        )
      );
    }
  };

  const ClickStatus = async (
    selectedStatus: string,
    orderId: string,
    orderType: string,
    userId: string,
    riderId: string
  ) => {
    console.log("Selected Status:", selectedStatus, orderId, orderType, userId);
    if (selectedStatus === "goTocafe") {
      await dispatch(goToCafeHandler(orderId, orderType));
    } else if (selectedStatus === "goToClient") {
      await dispatch(goToClientHandler(orderId, orderType));
    } else if (selectedStatus === "makingMenu") {
      await dispatch(makingMenuHandler(orderId, orderType));
    } else if (selectedStatus === "delivered") {
      await dispatch(completeOrderHandler(orderId, orderType));
      await dispatch(refetchUser());
      dispatch(clearOngoingOrder());
      stopTracking();
      orderSocket?.emit("order_completed", { orderId, userId });
    }
    fetchOrders(); // 상태 변경 후 주문 목록 새로고침
  };

  const renderOrder = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      {/* 상단: 가게 이름 + 상태 */}
      <View style={styles.cardHeader}>
        <View style={styles.cafeInfo}>
          <Icon name="store" size={20} color="#1A1A1A" />
          <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        </View>
        <Text
          style={[
            styles.status,
            item.status === "pending"
              ? styles.pendingStatus
              : item.status === "inProgress" ||
                item.status === "accepted" ||
                item.status === "goToCafe" ||
                item.status === "goToClient" ||
                item.status === "makingMenu"
              ? styles.inProgressStatus
              : item.status === "delivered"
              ? styles.completedStatus
              : item.status === "cancelled"
              ? styles.cancelledStatus
              : null,
          ]}
        >
          {item.status === "pending"
            ? "수락 대기 중"
            : item.status === "accepted"
            ? "배달 중"
            : item.status === "goToCafe"
            ? "가게로 이동 중"
            : item.status === "goToClient"
            ? "고객에게 이동 중"
            : item.status === "makingMenu"
            ? "제품 픽업 완료"
            : item.status === "delivered"
            ? "배달 완료"
            : item.status === "cancelled"
            ? "배달 취소"
            : "알 수 없음"}
        </Text>
      </View>

      {/* 중단: 주문 정보 */}
      <View style={styles.orderInfo}>
        <Text style={styles.menuName}>{item.items[0]?.menuName}</Text>
        <Text style={styles.deliveryFee}>{`${item.deliveryFee}원`}</Text>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ko })}
        </Text>
      </View>

      {/* 진행 중일 때 프로그레스 바 */}
      {item.status !== "delivered" && item.status !== "cancelled" && (
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  item.status === "delivered" || item.status === "cancelled"
                    ? "#006AFF"
                    : "#34C759",
              },
            ]}
          />
        </View>
      )}

      {/* 하단: 버튼 */}
      {item.status !== "delivered" && item.status !== "cancelled" && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setSelectedOrder(item)}>
            <Icon name="edit" size={18} color="#FFF" />
            <Text style={styles.actionText}>상태 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate("DeliveryImage", { item })}
          >
            <Icon name="camera-alt" size={18} color="#FFF" />
            <Text style={styles.actionText}>사진 업로드</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={selectedOrder !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChangeStatusPicker
              onClose={() => setSelectedOrder(null)}
              onConfirm={(selectedStatus) => {
                if (selectedOrder) {
                  ClickStatus(
                    selectedStatus,
                    selectedOrder._id,
                    selectedOrder.orderType,
                    selectedOrder.userId,
                    selectedOrder.riderId
                  );
                  setSelectedOrder(null);
                }
              }}
            />
          </View>
        </View>
      </Modal>

      {/* 필터 탭 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterTab === "inProgress" && styles.activeFilterTab]}
          onPress={() => filterOrders("inProgress")}
        >
          <Icon
            name="directions-bike"
            size={20}
            color={filterTab === "inProgress" ? "#FFF" : "#666666"}
          />
          <Text
            style={[styles.filterText, filterTab === "inProgress" && styles.activeFilterText]}
          >
            배달 중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterTab === "completed" && styles.activeFilterTab]}
          onPress={() => filterOrders("completed")}
        >
          <Icon
            name="check-circle"
            size={20}
            color={filterTab === "completed" ? "#FFF" : "#666666"}
          />
          <Text
            style={[styles.filterText, filterTab === "completed" && styles.activeFilterText]}
          >
            완료/취소
          </Text>
        </TouchableOpacity>
      </View>

      {/* 주문 리스트 */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA", // 연한 회색 배경
  },
  filterContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#E8ECEF",
  },
  activeFilterTab: {
    backgroundColor: "#006AFF",
  },
  filterText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666666",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#FFF",
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cafeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 8,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    color: "#FFF",
  },
  pendingStatus: {
    backgroundColor: "#FFD60A", // 더 부드러운 노랑
  },
  inProgressStatus: {
    backgroundColor: "#34C759", // 더 조화로운 초록
  },
  completedStatus: {
    backgroundColor: "#006AFF", // 토스 파랑
  },
  cancelledStatus: {
    backgroundColor: "#B0B0B0", // 더 차분한 회색
    color: "#FFF",
  },
  orderInfo: {
    marginBottom: 10,
  },
  menuName: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "700",
    color: "#006AFF",
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: "#666666",
    marginTop: 5,
  },
  progressBar: {
    height: 5,
    backgroundColor: "#E8ECEF",
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    width: "50%",
    height: "100%",
    borderRadius: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006AFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FA",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
});

export default DeliveryList;