import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import {
  getCompletedOrdersHandler,
  getOngoingOrdersHandler,
} from "../../redux/actions/orderAction";
import { WebSocketContext } from "../../utils/sockets/Socket";
import { selectUser } from "../../redux/reducers/userSlice";
import { Button } from "react-native-paper";
import { navigate } from "../../navigation/NavigationUtils";

interface OrderItem {
  _id: string;
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

}

const DeliveryRequestListScreen: React.FC = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(route.params?.loading ?? true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [Allorders, setAllorders] = useState<OrderItem[]>([]);

  const [activeTab, setActiveTab] = useState<"orders" | "deliveries">("orders");

  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const user = useAppSelector(selectUser);
  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getCompletedOrdersHandler());
      const ongoingOrdersResponse = await dispatch(getOngoingOrdersHandler());

      const allOrders = [
        ...(completedOrdersResponse || []),
        ...(ongoingOrdersResponse || []),
      ];

      allOrders.sort((a: OrderItem, b: OrderItem) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setOrders(allOrders);
      setAllorders(allOrders)
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    socket?.on("emitMatchTest", () => {
      fetchOrders();
    });

    return () => {
      unsubscribe();
      socket?.off("emitMatchTest");
    };
  }, [navigation, socket]);




  const renderOrder = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>...</Text>
        </TouchableOpacity>
      </View>
      {item.deliveryType === "direct" ? <Text style={styles.address}>{`${item.lat}, ${item.lng}`}</Text> : <Text style={styles.address}>{item.selectedFloor}</Text>}
      
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
          : item.status === "matchFailed"
          ? "배달 요청 실패!"
          : "완료"}
      </Text>
      
      {/* 일단 임시로  pending일때로 가보자자 */}
      {item.status !== "pending" && (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigate("LiveMap", { orderId: item._id })} // 주문 ID 전달
  >
    <Text style={styles.buttonText}>배달 위치 확인하기</Text>
  </TouchableOpacity>
)}

      <View style={styles.rowFooter}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        <Text style={styles.timeInfo}>{`${format(
          new Date(item.startTime),
          "HH:mm"
        )}`}</Text>
                <Text style={styles.timeInfo}>{`${format(
          new Date(item.endTime),
          "HH:mm"
        )}`}</Text>
      </View>
      <View style={styles.rowFooter}>

        <Text style={styles.deliveryFee}>{`${item.deliveryFee}원`}</Text>
        <Text style={styles.timeInfo}>{item.riderRequest}</Text>

        <Text style={styles.timeAgo}>{`${formatDistanceToNow(
          new Date(item.createdAt),
          { addSuffix: true, locale: ko }
        )}`}</Text>
      </View>
    </View>
  );



  const handleFilter = (type: string | null) => {
    if (type) {
      // 특정 필터 적용
      setOrders(Allorders.filter((item) => item.status === type));
    } else {
      // 필터 해제 (전체 보기)
      setOrders(Allorders);
    }
  };





  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* 주문 목록 & 배달 목록 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === "orders" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("orders")}
        >
          <Text style={styles.buttonText}>주문 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === "deliveries" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("deliveries")}
        >
          <Text style={styles.buttonText}>배달 목록</Text>
        </TouchableOpacity>
      </View>
  
      {/* 주문 목록 화면 */}
      {activeTab === "orders" ? (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleFilter("pending")}>
              <Text style={styles.buttonText}>수락 대기 중</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleFilter("delivered")}>
              <Text style={styles.buttonText}>배달중</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleFilter("accepted")}>
              <Text style={styles.buttonText}>배달완료 & 배달취소</Text>
            </TouchableOpacity>
          </View>
  
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrder}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        // 배달 목록 화면
        <View style={styles.deliveryContainer}>
          <Text style={styles.deliveryText}>배달 목록 화면입니다.</Text>
          {/* 배달 목록을 위한 UI 추가 */}
        </View>
      )}
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: "#6200ee",
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop:12,
    marginHorizontal:10
  },
  button: {
    backgroundColor: '#8A67F8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeliveryRequestListScreen;
