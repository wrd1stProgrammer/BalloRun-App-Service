import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { format } from "date-fns";
import { useAppDispatch } from "../../redux/config/reduxHook";
import {
  getCompletedOrdersHandler,
  getOngoingOrdersHandler,
} from "../../redux/actions/orderAction";
import { WebSocketContext } from "../../utils/Socket";

interface OrderItem {
  _id: string;
  items: { cafeName: string; menuName: string }[];
  lat: string;
  lng: string;
  deliveryType: string;
  status: string;
  pickupTime: string;
  deliveryFee: number;
  createdAt: number;
  riderRequest: string
}

const DeliveryRequestListScreen: React.FC = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(route.params?.loading ?? true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);

  // API 호출하여 데이터 가져오기
  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getCompletedOrdersHandler());
      const ongoingOrdersResponse = await dispatch(getOngoingOrdersHandler());

      const allOrders = [
        ...(completedOrdersResponse || []),
        ...(ongoingOrdersResponse || []),
      ];

      // 최신순 정렬 (createdAt 기준)
      allOrders.sort((a: OrderItem, b: OrderItem) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setOrders(allOrders);
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 화면 포커스될 때 데이터 새로고침
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    // 소켓 이벤트 처리
    socket?.on("emitMatchTest", () => {
      console.log("Socket response received");
      fetchOrders();
    });

    return () => {
      unsubscribe();
      socket?.off("emitMatchTest");
    };
  }, [navigation, socket]);

  const renderOrder = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
      <Text style={styles.address}>
        {item.lat}, {item.lng}
      </Text>
      <View style={styles.row}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        <Text style={styles.deliveryType}>
          {item.riderRequest}
        </Text>
        <Text style={styles.date}>
          {format(new Date(item.pickupTime), "yyyy/MM/dd HH:mm")}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.deliveryFee}>{item.deliveryFee}원</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>배달 요청 목록</Text>
      </View>

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
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // 하단 여백 추가
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
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
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
  defaultStatus: {
    fontSize: 14,
    color: "#9e9e9e",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeliveryRequestListScreen;
