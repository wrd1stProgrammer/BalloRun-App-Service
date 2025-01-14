import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { format } from "date-fns";
import { useAppDispatch } from "../../redux/config/reduxHook";
import { getCompletedOrdersHandler, getOngoingOrdersHandler } from "../../redux/actions/orderAction";

interface OrderItem {
  _id: string;
  items: { cafeName: string; menuName: string }[];
  lat: string;
  lng: string;
  deliveryType: string;
  status: string;
  pickupTime: string;
  deliveryFee: number;
}

const DeliveryRequestListScreen : React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();

  // API 호출하여 데이터 가져오기
  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getCompletedOrdersHandler());
      const ongoingOrdersResponse = await dispatch(getOngoingOrdersHandler());
  
      setOrders([
        ...(completedOrdersResponse || []), // undefined일 경우 빈 배열 처리
        ...(ongoingOrdersResponse || []),
      ]);

      console.log(orders,'셋오더');
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]); // 오류 발생 시 빈 배열로 초기화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Text style={styles.pendingStatus}>수락 대기중</Text>;
      case "inProgress":
        return <Text style={styles.inProgressStatus}>요청 진행중</Text>;
      case "delivered":
        return <Text style={styles.completedStatus}>수락 완료</Text>;
      default:
        return <Text style={styles.defaultStatus}>기타 상태</Text>;
    }
  };

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
        <Text style={styles.date}>
          {format(new Date(item.pickupTime), "yyyy/MM/dd HH:mm")}
        </Text>
      </View>
      <View style={styles.row}>
        {renderStatus(item.status)}
        <Text style={styles.deliveryFee}>{item.deliveryFee}원</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>배달 요청 목록</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
