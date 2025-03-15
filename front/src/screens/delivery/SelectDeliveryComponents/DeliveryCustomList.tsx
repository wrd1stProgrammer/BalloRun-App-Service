import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { acceptActionHandler } from "../../../redux/actions/riderAction";
import { navigate } from "../../../navigation/NavigationUtils";
import DeliveryDetailModal from "../DeliveryDetailComponents/DeliveryDetailModal";
import { useLocation } from "../../../utils/Geolocation/LocationContext";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import Cafe from "../../../assets/Icon/icon-coffee.png";
import Noodle from "../../../assets/Icon/icon-noodles.png";

type DeliveryItem = {
  _id: string;
  name: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupHolder";
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder";
};

type DeliveryCustomListProps = {
  deliveryItems: DeliveryItem[];
  userLat: number;
  userLng: number;
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 (km)
}

const DeliveryCustomList: React.FC<DeliveryCustomListProps> = ({ deliveryItems, userLat, userLng }) => {
  const [sortedItems, setSortedItems] = useState<DeliveryItem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"distance" | "price">("distance");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<"all" | "direct" | "cupHolder">("all");
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tabAnimation] = useState(new Animated.Value(0)); // 슬라이딩 애니메이션

  const socket = useContext(MapSocketContext);
  const dispatch = useAppDispatch();
  const { startTracking } = useLocation();
  const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>({});

  // 탭 슬라이딩 애니메이션
  const animateTab = (index: number) => {
    Animated.spring(tabAnimation, {
      toValue: index * (SCREEN_WIDTH / 3), // 3개의 탭
      useNativeDriver: true,
    }).start();
  };

  const SCREEN_WIDTH = 360; // 예시 값, 실제 디바이스 폭에 맞게 조정 가능

  const openModal = (item: DeliveryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAccept = () => {
    if (selectedItem) {
      acceptHandler(selectedItem._id, selectedItem.orderType);
      closeModal();
    }
  };

  const acceptHandler = async (orderId: string, orderType: "Order" | "NewOrder") => {
    try {
      await dispatch(acceptActionHandler(orderId, orderType));
      setTrackingOrders((prev) => ({ ...prev, [orderId]: true }));
      dispatch(setIsOngoingOrder(true));
      socket?.emit("start_tracking", { orderId });
      startTracking(orderId);

      setTimeout(() => {
        navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
      }, 1500);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    let filteredItems = [...deliveryItems];

    if (selectedDeliveryType !== "all") {
      filteredItems = filteredItems.filter((item) => item.deliveryType === selectedDeliveryType);
    }

    if (sortCriteria === "distance") {
      filteredItems.sort((a, b) =>
        getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(b.lng)) -
        getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng))
      );
    } else if (sortCriteria === "price") {
      filteredItems.sort((a, b) => b.deliveryFee - a.deliveryFee);
    }

    setSortedItems(filteredItems);
  }, [sortCriteria, selectedDeliveryType, deliveryItems, userLat, userLng]);

  const renderItem = ({ item }: { item: DeliveryItem }) => {
    const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng)).toFixed(1);
    const now = new Date();
    const endTime = new Date(item.endTime);
    const diff = endTime.getTime() - now.getTime();
    const timeRemaining = diff <= 0 ? "종료됨" : `${Math.floor(diff / (1000 * 60 * 60))}시간 ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}분 남음`;
    const isCafe = item.items[0].cafeName === "편의점";

    return (
      <View style={styles.itemContainer}>
        <View style={styles.leftSection}>
          <Image source={isCafe ? Noodle : Cafe} style={styles.cafeLogo} />
          <Text style={styles.timeRemaining}>{timeRemaining}</Text>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.cafeName}>{item.items[0].cafeName}</Text>
          <Text style={styles.info}>{item.deliveryType === "direct" ? "직접 배달" : "컵홀더 배달"}</Text>
          <Text style={styles.info}>{distance} km</Text>
          <Text style={styles.price}>{item.deliveryFee.toLocaleString()}원</Text>
        </View>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={[styles.acceptButton, trackingOrders[item._id] && styles.disabledButton]}
          disabled={trackingOrders[item._id]}
        >
          <Text style={styles.buttonText}>{trackingOrders[item._id] ? "배달 중" : "수락"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>배달이 없습니다</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 슬라이딩 탭 */}
      <View style={styles.tabContainer}>
        {["all", "direct", "cupHolder"].map((type, index) => (
          <TouchableOpacity
            key={type}
            style={styles.tabButton}
            onPress={() => {
              setSelectedDeliveryType(type as "all" | "direct" | "cupHolder");
              animateTab(index);
            }}
          >
            <Text style={[styles.tabText, selectedDeliveryType === type && styles.activeTabText]}>
              {type === "all" ? "전체" : type === "direct" ? "직접" : "컵홀더"}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: tabAnimation }] }]} />
      </View>

      {/* 정렬 옵션 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "distance" && styles.activeSortButton]}
          onPress={() => setSortCriteria("distance")}
        >
          <Text style={[styles.sortText, sortCriteria === "distance" && styles.activeSortText]}>거리순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "price" && styles.activeSortButton]}
          onPress={() => setSortCriteria("price")}
        >
          <Text style={[styles.sortText, sortCriteria === "price" && styles.activeSortText]}>가격순</Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={sortedItems.length === 0 ? { flex: 1 } : null}
      />
      <DeliveryDetailModal visible={modalVisible} onClose={closeModal} onAccept={handleAccept} deliveryItem={selectedItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 16,
    paddingTop: 1,
  },
  // 탭 스타일
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#2563EB",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: "31%", // 3개 탭이므로 1/3 폭
    height: 2,
    backgroundColor: "#2563EB",
    borderRadius: 1,
  },
  // 정렬 스타일
  sortContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 12,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  activeSortButton: {
    backgroundColor: "#2563EB",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeSortText: {
    color: "#FFFFFF",
  },
  // 리스트 아이템 스타일
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  leftSection: {
    alignItems: "center",
    marginRight: 12,
  },
  cafeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  timeRemaining: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 4,
  },
  centerSection: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
  acceptButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // 빈 리스트 스타일
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
  },
});

export default DeliveryCustomList;