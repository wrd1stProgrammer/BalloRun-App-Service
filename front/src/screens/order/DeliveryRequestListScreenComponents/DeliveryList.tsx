/* DeliveryList.tsx – UI 리팩터링 */

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
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch } from "../../../redux/config/reduxHook";
import { getDeliveryListHandler } from "../../../redux/actions/orderAction";
import {
  completeOrderHandler,
  goToCafeHandler,
  goToClientHandler,
  makingMenuHandler,
} from "../../../redux/actions/riderAction";
import { clearOngoingOrder } from "../../../redux/reducers/userSlice";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import ChangeStatusPicker from "./DeliveryListComponents.tsx/ChangeStatusPicker";
import { navigate } from "../../../navigation/NavigationUtils";
import { refetchUser } from "../../../redux/actions/userAction";

interface OrderItem {
  _id: string;
  userId: string;
  items: { cafeName: string; menuName: string }[];
  deliveryFee: number;
  createdAt: number;
  updatedAt: string;
  status: string;
  riderId: string;
  orderType: string;
  roomId:string;
  username: string;
  userImage: string;
  nickname: string;
}

interface Props {
  activeTab: "orders" | "deliveries";
}

/* ----------------------------- 색상 팔레트 ----------------------------- */
const COLORS = {
  primary: "#1D71F2",
  grey50: "#F0F2F5",
  grey300: "#D1D5DB",
  grey600: "#6B7280",
  grey800: "#1F2937",
  warning: "#FFD60A",
  success: "#34C759",
  danger: "#B0B0B0",
};

const STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "수락 대기",
    color: "#A16207",
    bg: "#FEF3C7",
  },
  accepted: { label: "배달 준비", color: COLORS.primary, bg: "#DBE8FF" },
  goToCafe: { label: "가게로 이동", color: COLORS.primary, bg: "#DBE8FF" },
  makingMenu: { label: "픽업 완료", color: COLORS.primary, bg: "#DBE8FF" },
  goToClient: { label: "고객에게 이동", color: COLORS.primary, bg: "#DBE8FF" },
  delivered: { label: "배달 완료", color: COLORS.success, bg: "#DCFCE7" },
  cancelled: { label: "취소", color: COLORS.grey600, bg: "#F3F4F6" },
};

const DeliveryList: React.FC<Props> = ({ activeTab }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [filterTab, setFilterTab] = useState<"inProgress" | "completed">(
    "inProgress",
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const navigation = useNavigation();

  /* ----------------------------- fetch ----------------------------- */
  const fetchOrders = async () => {
    try {
      const res = await dispatch(getDeliveryListHandler());
      const sorted = res.sort(
        (a: OrderItem, b: OrderItem) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setAllOrders(sorted);
      applyFilter(sorted, filterTab);
    } catch (e) {
      console.error(e);
      setAllOrders([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (list: OrderItem[], tab: "inProgress" | "completed") => {
    if (tab === "inProgress") {
      setOrders(
        list.filter(
          (o) => o.status !== "delivered" && o.status !== "cancelled",
        ),
      );
    } else {
      setOrders(list.filter((o) => o.status === "delivered" || o.status === "cancelled"));
    }
  };

  /* --------------------------- lifecycle -------------------------- */
  useEffect(() => {
    if (activeTab === "deliveries") {
      fetchOrders();
      socket?.on("emitMatchTest", fetchOrders);
      return () => socket?.off("emitMatchTest");
    }
  }, [activeTab]);

  /* --------------------------- refresh --------------------------- */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  /* -------------------------- status change ------------------------- */
  const handleStatusChange = async (next: string, o: OrderItem) => {
    const { _id, orderType, userId, riderId } = o;
    switch (next) {
      case "goTocafe":
        await dispatch(goToCafeHandler(_id, orderType));
        break;
      case "goToClient":
        await dispatch(goToClientHandler(_id, orderType));
        break;
      case "makingMenu":
        await dispatch(makingMenuHandler(_id, orderType));
        break;
      case "delivered":
        await dispatch(completeOrderHandler(_id, orderType));
        await dispatch(refetchUser());
        dispatch(clearOngoingOrder());
        socket?.emit("order_completed", { orderId: _id, userId });
        break;
    }
    fetchOrders();
  };

  /* -------------------------- render item -------------------------- */
  const renderOrder = ({ item }: { item: OrderItem }) => {
    const statusObj = STATUS_MAP[item.status] || STATUS_MAP.pending;
    return (
      <View style={styles.card}>
        {/* ------ 헤더 ------ */}
        <View style={styles.cardHeader}>
          <View style={styles.cafeRow}>
            <Icon name="store" size={18} color={COLORS.grey800} />
            <Text numberOfLines={1} style={styles.cafeName}>
              {item.items[0]?.cafeName}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigate("OrderDetailScreen", { orderId: item._id, orderType: item.orderType })}>
            <Icon name="chevron-right" size={22} color={COLORS.grey600} />
          </TouchableOpacity>
        </View>

        {/* ------ 메뉴 ------ */}
        <Text numberOfLines={1} style={styles.menuName}>
          {item.items[0]?.menuName}
        </Text>

        {/* ------ 금액 & 시간 ------ */}
        <View style={styles.metaRow}>
          <Text style={styles.deliveryFee}>{item.deliveryFee.toLocaleString()}원</Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </Text>
        </View>

        {/* ------ 상태 Chip ------ */}
        <View
          style={[
            styles.statusChip,
            { backgroundColor: statusObj.bg },
          ]}
        >
          <Text style={[styles.statusText, { color: statusObj.color }]}>
            {statusObj.label}
          </Text>
        </View>

        {/* ------ 액션 ------ */}
        {item.status !== "delivered" && item.status !== "cancelled" && (
          <View style={styles.actions}>
            <ActionBtn
              icon="edit"
              label="상태 변경"
              onPress={() => setSelectedOrder(item)}
            />
            <ActionBtn
              icon="chat"
              label="1:1 채팅"
              onPress={() => navigate("ChatRoom", {
                roomId: item.roomId,
                username: item.username,
                nickname: item.nickname,
                userImage: item.userImage,
              })}
            />
          </View>
        )}
      </View>
    );
  };

  /* -------------------------- UI -------------------------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== status picker modal ===== */}
      <Modal
        transparent
        visible={!!selectedOrder}
        animationType="fade"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <ChangeStatusPicker
              onClose={() => setSelectedOrder(null)}
              onConfirm={(s) => selectedOrder && (handleStatusChange(s, selectedOrder), setSelectedOrder(null))}
            />
          </View>
        </View>
      </Modal>

      {/* ===== 탭 ===== */}
      <View style={styles.filterBar}>
        <FilterTab
          icon="directions-bike"
          active={filterTab === "inProgress"}
          label="배달 중"
          onPress={() => {
            setFilterTab("inProgress");
            applyFilter(allOrders, "inProgress");
          }}
        />
        <FilterTab
          icon="check-circle"
          active={filterTab === "completed"}
          label="완료/취소"
          onPress={() => {
            setFilterTab("completed");
            applyFilter(allOrders, "completed");
          }}
        />
      </View>

      {/* ===== list ===== */}
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>표시할 주문이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => i._id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 14 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
};

/* --------------------- 재사용 컴포넌트 & 스타일 --------------------- */
const FilterTab = ({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.tabBtn, active && styles.tabBtnActive]}
    onPress={onPress}
  >
    <Icon
      name={icon}
      size={20}
      color={active ? "#FFF" : COLORS.grey600}
      style={{ marginRight: 6 }}
    />
    <Text style={[styles.tabText, active && { color: "#FFF" }]}>{label}</Text>
  </TouchableOpacity>
);

const ActionBtn = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actBtn} onPress={onPress}>
    <Icon name={icon} size={18} color="#FFF" />
    <Text style={styles.actText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* ---------------- 탭 ---------------- */
  filterBar: { flexDirection: "row", padding: 12, gap: 8 },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.grey300,
  },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 15, fontWeight: "600", color: COLORS.grey600 },

  /* ---------------- 카드 ---------------- */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cafeRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  cafeName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.grey800,
    marginLeft: 6,
    flexShrink: 1,
  },

  menuName: { fontSize: 15, color: COLORS.grey800, marginTop: 6 },

  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  deliveryFee: { fontSize: 15, fontWeight: "700", color: COLORS.primary },
  time: { fontSize: 12, color: COLORS.grey600 },

  statusChip: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  actions: {
    flexDirection: "row",
    marginTop: 14,
    gap: 8,
  },
  actBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3384FF",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  actText: { color: "#FFF", fontWeight: "600", fontSize: 14 },

  /* ---------------- modal ---------------- */
  modalBg: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalCard: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    elevation: 6,
  },

  emptyText: { fontSize: 16, color: COLORS.grey600, fontWeight: "600" },
});

export default DeliveryList;
