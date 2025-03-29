import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ListRenderItem,
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

const SCREEN_WIDTH = 360;

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
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DeliveryCustomList: React.FC<DeliveryCustomListProps> = ({ deliveryItems, userLat, userLng }) => {
  const [sortedItems, setSortedItems] = useState<DeliveryItem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"distance" | "price">("distance");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<"all" | "direct" | "cupHolder">("all");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const socket = useContext(MapSocketContext);
  const dispatch = useAppDispatch();
  const { startTracking } = useLocation();

  useEffect(() => {
    let filtered = [...deliveryItems];
    if (selectedDeliveryType !== "all") {
      filtered = filtered.filter((item) => item.deliveryType === selectedDeliveryType);
    }
    if (sortCriteria === "distance") {
      filtered.sort((a, b) =>
        getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(a.lng)) -
        getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng))
      );
    } else {
      filtered.sort((a, b) => b.deliveryFee - a.deliveryFee);
    }
    setSortedItems(filtered);
  }, [sortCriteria, selectedDeliveryType, deliveryItems, userLat, userLng]);

  const toggleSortOptions = () => {
    setShowSortOptions((prev) => !prev);
  };

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

  const renderItem: ListRenderItem<DeliveryItem> = ({ item }) => {
    const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng)).toFixed(1);
    const now = new Date();
    const endTime = new Date(item.endTime);
    const diff = endTime.getTime() - now.getTime();
    const timeRemaining =
      diff <= 0
        ? "종료됨"
        : `${Math.floor(diff / (1000 * 60 * 60))}시간 ${Math.floor(
            (diff % (1000 * 60 * 60)) / (1000 * 60)
          )}분 남음`;
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
      <View style={styles.filterContainer}>
        {/* 기본순 */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={[styles.filterButton, styles.activeFilterButton]}
            onPress={toggleSortOptions}
          >
            <Text style={[styles.filterButtonText, styles.activeFilterText]}>
              기본순 ▼ ({sortCriteria === "distance" ? "거리순" : "가격순"})
            </Text>
          </TouchableOpacity>
          {showSortOptions && (
            <View style={styles.sortDropdown}>
              <TouchableOpacity
                onPress={() => {
                  setSortCriteria("distance");
                  setShowSortOptions(false);
                }}
                style={styles.dropdownOption}
              >
                <Text style={styles.dropdownText}>거리순</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSortCriteria("price");
                  setShowSortOptions(false);
                }}
                style={styles.dropdownOption}
              >
                <Text style={styles.dropdownText}>가격순</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 필터 */}
        {["all", "direct", "cupHolder"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, selectedDeliveryType === type && styles.activeFilterButton]}
            onPress={() => setSelectedDeliveryType(type as "all" | "direct" | "cupHolder")}
          >
            <Text style={[styles.filterButtonText, selectedDeliveryType === type && styles.activeFilterText]}>
              {type === "all" ? "전체" : type === "direct" ? "직접" : "컵홀더"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={sortedItems.length === 0 ? { flex: 1 } : undefined}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => {
            setIsRefreshing(false);
          }, 1000);
        }}
      />

      <DeliveryDetailModal
        visible={modalVisible}
        onClose={closeModal}
        onAccept={handleAccept}
        deliveryItem={selectedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  activeFilterButton: {
    backgroundColor: "#111827",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  sortDropdown: {
    position: "absolute",
    top: 42,
    left: 0,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
    width: 100,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#111827",
  },
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
