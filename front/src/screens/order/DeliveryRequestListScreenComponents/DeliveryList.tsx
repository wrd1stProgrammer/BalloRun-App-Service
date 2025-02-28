import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { id, ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native"; // useNavigation 사용
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import {
    getDeliveryListHandler,
} from "../../../redux/actions/orderAction";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import { navigate } from "../../../navigation/NavigationUtils";
import {launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import ChangeStatusPicker from "./DeliveryListComponents.tsx/ChangeStatusPicker";
import { completeOrderHandler, goToCafeHandler, goToClientHandler, makingMenuHandler } from "../../../redux/actions/riderAction";
import { clearOngoingOrder, setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { useLocation } from "../../../utils/Geolocation/LocationContext";
import { refetchUser } from "../../../redux/actions/userAction";



interface OrderItem {
  _id: string;
  userId:string;
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
  orderType:string;
  riderId:string
}

interface OrderListProps {
    activeTab: "orders" | "deliveries";
  }

const DeliveryList: React.FC<OrderListProps> = ({activeTab}) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null); //  선택된 주문 저장

  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const navigation = useNavigation(); // ✅ useNavigation 사용

  const orderSocket = useContext(WebSocketContext); // WebSocketContext에서 소켓 가져오기
  const { location, startTracking, stopTracking } = useLocation();
  

  const [filterTab, setFilterTab] = useState<any>("inProgress");


  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getDeliveryListHandler());
      const sortedOrders = completedOrdersResponse.sort(
        (a: OrderItem, b: OrderItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setOrders(sortedOrders);
      setAllOrders(sortedOrders);
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab == "deliveries"){
        socket?.on("emitMatchTest", fetchOrders);
        fetchOrders();
    
        return () => {
          fetchOrders();
          socket?.off("emitMatchTest");
        };
    }
    else(console.log("나의 주문 목록 보기가 아님"))

  }, [navigation,socket,activeTab]);

  const handleFilter = (type: string | null) => {
    if (type) {
      setOrders(allOrders.filter((item) => item.status === type));
    } else {
      setOrders(allOrders);
    }
  };

  const handleFilter_1 = (type: string | null) => {
    if (type) {
      setOrders(allOrders.filter((item) => item.status !== type));
    } else {
      setOrders(allOrders);
    }
  };





  const ClickStatus = async (selectedStatus:String,orderId:string,orderType:string,userId:string,riderId:string) => {
    console.log("Selected Status:", selectedStatus, orderId,orderType,userId);
    if (selectedStatus === "goTocafe") {
      await dispatch(goToCafeHandler(orderId,orderType));
    } else if (selectedStatus === "goToClient") { // 구매하러감
      await dispatch(goToClientHandler(orderId,orderType));
    } else if (selectedStatus === "makingMenu") { 
      await dispatch(makingMenuHandler(orderId,orderType));
    } else if (selectedStatus === "delivered") {
      await dispatch(completeOrderHandler(orderId,orderType));
      await dispatch(refetchUser());
      dispatch(clearOngoingOrder()); // ✅ 배달자 화면에서 Redux 초기화
      stopTracking();
      // ✅ 주문자의 userId를 포함하여 소켓으로 배달 완료 이벤트 전송
      orderSocket?.emit("order_completed", { orderId,userId });
    }
  }


  const renderOrder = ({ item }: { item: OrderItem }) => (
    <>
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>...</Text>
        </TouchableOpacity>
      </View>
      {item.deliveryType === "direct" ? (
        <Text style={styles.address}>{`${item.lat}, ${item.lng}`}</Text>
      ) : (
        <Text style={styles.address}>{item.selectedFloor}</Text>
      )}

      <Text
        style={
          item.status === "pending"
            ? styles.pendingStatus
            : item.status === "inProgress"
            ? styles.inProgressStatus
            : styles.completedStatus
        }
      >
        {item.status === "pending"
          ? "수락 대기 중"
          : item.status === "accepted"
          ? "배달중 accepted"
          : item.status === "goToCafe" 
          ? "카페로 이동중"
          : item.status === "goToClient" 
          ? "고객에게 이동중"
          : item.status === "makingMenu" 
          ? "제품 픽업 완료"
          : item.status === "delivered" 
          ? "배달완료"
          : item.status === "cancelled" 
          ? "배달취소"
          :"수정"}
      </Text>

        {item.status !== "delivered" && item.status !== "cancelled" && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedOrder(item)} // ✅ 선택된 주문만 모달 열기
            >
              <Text style={styles.pendingStatus}>배달 상태 변경하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={
                () => navigate("DeliveryImage", { item })}
            >
              <Text style={styles.buttonText}>배달 완료 사진 업로드하기</Text>
            </TouchableOpacity>
            </>)}
      <View style={styles.rowFooter}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        {/* <Text style={styles.timeInfo}>{`${format(new Date(item.startTime), "HH:mm")}`}</Text>
        <Text style={styles.timeInfo}>{`${format(new Date(item.endTime), "HH:mm")}`}</Text> */}

      </View>
      <View style={styles.rowFooter}>

        <Text style={styles.deliveryFee}>{`${item.deliveryFee}원`}</Text>
        <Text style={styles.timeInfo}>주문수락시간:{`${formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: ko })}`}
        </Text>

        <Text style={styles.timeInfo}>{item.riderRequest}</Text>
        <Text style={styles.timeAgo}>
          {`${formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ko })}`}
        </Text>
      </View>
    </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Modal
          visible={selectedOrder !== null} // ✅ 특정 주문이 선택되었을 때만 모달 표시
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedOrder(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ChangeStatusPicker
                onClose={() => setSelectedOrder(null)}
                onConfirm={(selectedStatus) => {
                  if (selectedOrder) {
                    ClickStatus(selectedStatus, selectedOrder._id, selectedOrder.orderType, selectedOrder.userId, selectedOrder.riderId);
                    setSelectedOrder(null)
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter_1("delivered")}>
          <Text style={styles.buttonText}>배달중</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter("complete")}>
          <Text style={styles.buttonText}>배달완료 & 배달취소</Text>
        </TouchableOpacity>
      </View> */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>배달 상태</Text>
          <View style={styles.deliveryTypeOptions}>
            {[
              { type: "inProgress", label: "배달중" },
              { type: "completed", label: "배달완료 & 취소" },
            ].map(({ type, label }) => (
              <TouchableOpacity
                key={type}
                style={[styles.filterButton, filterTab === type && styles.activeFilterButton]}
                onPress={() => {
                  setFilterTab(type as any);
                  type === "inProgress" ? handleFilter_1("delivered") : handleFilter("delivered");
                }}
              >
                <Text style={[styles.filterButtonText, filterTab === type && styles.activeFilterText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.divider} />
        </View>



      <FlatList
        data={orders}
        keyExtractor={(item, index) => item._id ? item._id : `key-${index}`} // ✅ _id가 없으면 index 사용
        renderItem={renderOrder}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: 5 }]} // 🚀 기존 16에서 10으로 줄임
        
      />
            </View>
    </>
  );
};



const styles =  StyleSheet.create({
  filterContainer: {
    marginBottom: 0,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: "#2563EB",
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  activeFilterText: {
    color: "#ffffff",
  },

  deliveryTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#6200ee",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  divider: {
    height: 1, // 선의 두께
    backgroundColor: "#D1D5DB", // 연한 회색
    marginVertical: 12, // 위아래 간격
    width: "100%",
  },
  card: {
    
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moreButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  pendingStatus: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  inProgressStatus: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  completedStatus: {
    fontSize: 14,
    color: "#6200ee",
    fontWeight: "bold",
  },
  rowFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#333",
  },
  timeInfo: {
    fontSize: 14,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  deliveryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DeliveryList;

