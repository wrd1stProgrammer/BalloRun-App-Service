import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ListRenderItem,
  Alert,
} from "react-native";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/config/reduxHook";
import { selectUser } from "../../../redux/reducers/userSlice";
import { navigate } from "../../../navigation/NavigationUtils";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";

const IMAGES: Record<string, any> = {
  편의점: require("../../../assets/Icon/cs64.png"),
  커피: require("../../../assets/Icon/cafe64.png"),
  음식: require("../../../assets/Icon/food64.png"),
  기타: require("../../../assets/Icon/etc64.png"),
  물품: require("../../../assets/Icon/product64.png"),
};

const SCREEN_WIDTH = 360;

type DeliveryItem = {
  _id: string;
  userId: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupholder" | any;
  startTime: string;
  deliveryFee: number;
  riderRequest: string;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder";
  orderDetails: string;
  images: string;
  orderImages: string;
};

type DeliveryCustomListProps = {
  deliveryItems: DeliveryItem[];
  userLat: number;
  userLng: number;
};

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
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

const DeliveryCustomList: React.FC<DeliveryCustomListProps> = ({
  deliveryItems,
  userLat,
  userLng,
}) => {
  const [sortedItems, setSortedItems] = useState<DeliveryItem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"distance" | "price">(
    "distance"
  );
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    "all" | "direct" | "cupHolder"
  >("all");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>(
    {}
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    let filtered = [...deliveryItems];
    if (selectedDeliveryType !== "all") {
      filtered = filtered.filter(
        (item) => item.deliveryType === selectedDeliveryType
      );
    }
    if (sortCriteria === "distance") {
      filtered.sort(
        (a, b) =>
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

  // cafeName에 따라 이미지 결정 (기본값: 기타)
  const getCategoryImage = (cafeName: string): any => {
    return IMAGES[cafeName] || IMAGES["기타"];
  };

  const renderItem: ListRenderItem<DeliveryItem> = ({ item }) => {
    const distance = getDistance(
      userLat,
      userLng,
      parseFloat(item.lat),
      parseFloat(item.lng)
    ).toFixed(1);
    const now = new Date();
    const endTime = new Date(item.endTime);
    const diff = endTime.getTime() - now.getTime();
    const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));
    const isEnded = diff <= 0;
    const timeRemaining = isEnded ? "종료됨" : `${minutes}분 남음`;

    const cafeName = item.items[0]?.cafeName || "기타";
    const imageSource = getCategoryImage(cafeName);
    const isMyOrder = item.userId === user?._id;
    const handleAcceptPress = () => {
      if (isEnded) {
        Alert.alert("알림", "이미 마감된 배달입니다.");
        return;
      }
      navigate("DeliveryDetail", { deliveryItem: item });
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.leftSection}>
          <Image source={imageSource} style={styles.cafeLogo} />
          <Text style={styles.timeRemaining}>{timeRemaining}</Text>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.cafeName}>{cafeName}</Text>
          <Text style={styles.info}>
            {item.deliveryType === "direct" ? "직접 배달" : "컵홀더 배달"}
          </Text>
          <Text style={styles.info}>{distance} km</Text>
          <Text style={styles.price}>
            {item.deliveryFee.toLocaleString()}원
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={handleAcceptPress}
            style={[
              styles.acceptButton,
              trackingOrders[item._id] && styles.disabledButton,
              isEnded && styles.endedButton,
              isMyOrder && styles.disabledButton,
            ]}
            disabled={trackingOrders[item._id] || isEnded || isMyOrder}
          >
            <Text
              style={[
                styles.buttonText,
                isEnded && styles.endedButtonText,
                trackingOrders[item._id] && styles.disabledButtonText,
              ]}
            >
              {isEnded
                ? "마감"
                : isMyOrder
                ? "내 주문"
                : trackingOrders[item._id]
                ? "배달 중"
                : "수락"}
            </Text>
          </TouchableOpacity>
          {isMyOrder && (
            <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>
              본인이 주문한 배달입니다
            </Text>
          )}
        </View>
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
            style={[
              styles.filterButton,
              selectedDeliveryType === type && styles.activeFilterButton,
            ]}
            onPress={() =>
              setSelectedDeliveryType(type as "all" | "direct" | "cupHolder")
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDeliveryType === type && styles.activeFilterText,
              ]}
            >
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
        contentContainerStyle={
          sortedItems.length === 0 ? { flex: 1 } : undefined
        }
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => {
            setIsRefreshing(false);
          }, 1000);
        }}
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
  endedButton: {
    backgroundColor: "#B0B0B0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#E5E7EB",
  },
  endedButtonText: {
    color: "#F5F5F5",
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
