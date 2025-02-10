import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native"; // useNavigation 사용
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import {
    getDeliveryListHandler,
} from "../../../redux/actions/orderAction";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import { navigate } from "../../../navigation/NavigationUtils";

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
  updatedAt: string
}

interface OrderListProps {
    activeTab: "orders" | "deliveries";
  }

const DeliveryList: React.FC<OrderListProps> = ({activeTab}) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const navigation = useNavigation(); // ✅ useNavigation 사용
  console.log(orders)
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

  const renderOrder = ({ item }: { item: OrderItem }) => (
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
          ? "배달중"
          : "배달완료"}
      </Text>
            {item.status !== "pending" && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigate("DeliveryImage")}
              >
                <Text style={styles.buttonText}>배달 완료 사진 업로드하기</Text>
              </TouchableOpacity>
            )}
      <View style={styles.rowFooter}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        <Text style={styles.timeInfo}>{`${format(new Date(item.startTime), "HH:mm")}`}</Text>
        <Text style={styles.timeInfo}>{`${format(new Date(item.endTime), "HH:mm")}`}</Text>

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter("accepted")}>
          <Text style={styles.buttonText}>배달중</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter("완료상태")}>
          <Text style={styles.buttonText}>배달완료 & 배달취소</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  data={orders}
  keyExtractor={(item, index) => item._id ? item._id : `key-${index}`} // ✅ _id가 없으면 index 사용
  renderItem={renderOrder}
  contentContainerStyle={styles.listContent}
/>
    </>
  );
};



const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
});

export default DeliveryList;
