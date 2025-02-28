import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { token_storage } from "../../../redux/config/storage";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { acceptActionHandler } from "../../../redux/actions/riderAction";
import Geolocation from 'react-native-geolocation-service';
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
  deliveryType: "direct" | "cupHolder" | any; // 🔥 배달 유형 추가
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string
  isReservation: boolean;
  orderType: "Order" | "NewOrder"
};

type DeliveryCustomListProps = {
  deliveryItems: DeliveryItem[];
  userLat: any;
  userLng: any;
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 (km)
}








function DeliveryCustomList({ deliveryItems, userLat, userLng }: DeliveryCustomListProps) {
  const [sortedItems, setSortedItems] = useState<DeliveryItem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"distance" | "price">("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<"all" | "direct" | "cupHolder">("all");
  const [selectedItem, setSelectedItem] = useState<DeliveryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
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


//여기서부터 수락 눌렀을때
const socket = useContext(MapSocketContext);
const [tracking, setTracking] = useState(false);
const dispatch = useAppDispatch();
const { location, startTracking, stopTracking } = useLocation();

// 위치 추적 ID 저장 (해제할 때 필요)
const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>({});




const acceptHandler = async (orderId: string,  orderType: "Order" | "NewOrder") => {
  try {
    console.log(orderId,orderType,"id logging");

    // 주문 수락 요청
    const dummyRes = await dispatch(acceptActionHandler(orderId,orderType));
    

    setTrackingOrders((prev) => ({ ...prev, [orderId]: true }));
    dispatch(setIsOngoingOrder(true));
    
    // 서버에 트래킹 시작 요청
    socket?.emit("start_tracking", { orderId });
    startTracking(orderId);


    // 위치 추적 시작
    console.log("Geolocation.watchPosition 실행...");
 

    setTimeout(() => {
      console.log("Navigating to BottomTab...");
      navigate("BottomTab", {
        screen: "DeliveryRequestListScreen",
      });
    }, 1500);
  } catch (error) {
    console.error("Error accepting order:", error);
  }
};

  useEffect(() => {
    let filteredItems = [...deliveryItems];

    // 1️⃣ 카페 이름으로 필터링
    if (searchQuery.trim() !== "") {
      filteredItems = filteredItems.filter((item) =>
        item.items[0].cafeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2️⃣ 배달 유형 필터링 (direct / cupholder / all)
    if (selectedDeliveryType !== "all") {
      filteredItems = filteredItems.filter((item) => item.deliveryType === selectedDeliveryType);
    }

    // 3️⃣ 정렬 적용 (거리순 또는 가격순)
    if (sortCriteria === "distance") {
      filteredItems.sort((a, b) => {
        const distanceA = getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(a.lng));
        const distanceB = getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng));
        return distanceA - distanceB;
      });
    } else if (sortCriteria === "price") {
      filteredItems.sort((a, b) => b.deliveryFee - a.deliveryFee);
    }

    setSortedItems(filteredItems);
  }, [sortCriteria, searchQuery, selectedDeliveryType, deliveryItems, userLat, userLng]);


  const renderItem = ({ item }) => {
    const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng)).toFixed(1);
    const now = new Date();
    const endTime = new Date(item.endTime);
    const diff = endTime - now;
    const timeRemaining = diff <= 0 ? "종료됨" : `${Math.floor(diff / (1000 * 60 * 60))}시간 ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}분 남음`;
    const isCafe = item.items[0].cafeName=="편의점"

    return (
      <View style={styles.itemContainer}>
        {/* 왼쪽: 카페 로고 및 종료 시간 */}
        <View style={styles.leftSection}>
          {isCafe ? <Image source={Noodle} style={styles.cafeLogo} />: <Image source={Cafe} style={styles.cafeLogo} />}
          
          <Text style={styles.timeRemaining}>{timeRemaining}</Text>
        </View>


        {/* 중앙: 배달 정보 */}
        <View style={styles.centerSection}>
          <Text style={styles.cafeName}>{item.items[0].cafeName}</Text>
          <Text style={styles.info}>배달 종류: {item.deliveryType === "direct" ? "직접 배달" : "컵홀더 배달"}</Text>
          <Text style={styles.info}>거리: {distance} km</Text>
                    <Text style={styles.price}>배달팁: {item.deliveryFee}원</Text>

        </View>

        {/* 오른쪽: 수락 버튼 */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={[styles.button, trackingOrders[item._id] && styles.disabledButton]}
            disabled={trackingOrders[item._id]}
          >
            <Text style={styles.buttonText}>
              {trackingOrders[item._id] ? "배달 중..." : "수락하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1️⃣ 검색 입력 필드 */}
      <TextInput
        style={styles.searchInput}
        placeholder="카페 이름 검색..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* 2️⃣ 배달 유형 필터 */}
<View style={styles.filterContainer}>
  <Text style={styles.filterLabel}>배달 유형</Text>
  <View style={styles.deliveryTypeOptions}>
    {[
      { type: "all", label: "전체" },
      { type: "direct", label: "직접 배달" },
      { type: "cupHolder", label: "컵홀더 배달" },
    ].map(({ type, label }) => (
      <TouchableOpacity
        key={type}
        style={[styles.filterButton, selectedDeliveryType === type && styles.activeFilterButton]}
        onPress={() => setSelectedDeliveryType(type)}
      >
        <Text style={[styles.filterButtonText, selectedDeliveryType === type && styles.activeFilterText]}>
          {label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
<View style={styles.divider} />

{/* 3️⃣ 정렬 옵션 버튼 */}
<View style={styles.filterContainer}>
  <Text style={styles.filterLabel}>정렬 기준</Text>
  <View style={styles.sortOptions}>
    {[
      { type: "distance", label: "거리순" },
      { type: "price", label: "가격순" },
    ].map(({ type, label }) => (
      <TouchableOpacity
        key={type}
        style={[styles.filterButton, sortCriteria === type && styles.activeFilterButton]}
        onPress={() => setSortCriteria(type)}
      >
        <Text style={[styles.filterButtonText, sortCriteria === type && styles.activeFilterText]}>
          {label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
<View style={styles.divider} />

      {/* <View style={styles.deliveryTypeOptions}>
        <TouchableOpacity
          style={[styles.deliveryTypeButton, selectedDeliveryType === "all" && styles.activeButton]}
          onPress={() => setSelectedDeliveryType("all")}
        >
          <Text style={styles.buttonText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deliveryTypeButton, selectedDeliveryType === "direct" && styles.activeButton]}
          onPress={() => setSelectedDeliveryType("direct")}
        >
          <Text style={styles.buttonText}>직접 배달</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deliveryTypeButton, selectedDeliveryType === "cupholder" && styles.activeButton]}
          onPress={() => setSelectedDeliveryType("cupholder")}
        >
          <Text style={styles.buttonText}>컵홀더 배달</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortOptions}>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "distance" && styles.activeButton]}
          onPress={() => setSortCriteria("distance")}
        >
          <Text style={styles.buttonText}>거리순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "price" && styles.activeButton]}
          onPress={() => setSortCriteria("price")}
        >
          <Text style={styles.buttonText}>가격순</Text>
        </TouchableOpacity>
      </View> */}

      {/* 4️⃣ 리스트 출력 */}
      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <DeliveryDetailModal visible={modalVisible} onClose={closeModal} onAccept={handleAccept} deliveryItem={selectedItem} />

    </View>
  );
}

export default DeliveryCustomList;

const styles = StyleSheet.create({
  divider: {
    height: 1, // 선의 두께
    backgroundColor: "#D1D5DB", // 연한 회색
    marginVertical: 12, // 위아래 간격
    width: "100%",
  },
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

  /** 🛵 배달 유형 필터 및 정렬 버튼 스타일 **/
  deliveryTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /** 📍 필터 버튼 스타일 **/
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
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Light gray background
    paddingHorizontal: 16,
  },

  /** 🏷️ Delivery Item Card **/
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // Android shadow
  },

  /** 📍 Left Section (Cafe Logo & Time) **/
  leftSection: {
    alignItems: "center",
    marginRight: 13,
  },
  cafeLogo: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  timeRemaining: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 3, // Softer edges
    textAlign: "center",
    marginTop: 6,
    backgroundColor: "#F3F4F6",
  },

  /** 🏠 Middle Section (Details) **/
  centerSection: {
    flex: 1,
    justifyContent: "center",
  },
  cafeName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 6,
  },

  /** ✅ Right Section (Accept Button) **/
  rightSection: {
    justifyContent: "center",

  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14, // 기존 24에서 14로 줄임
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  /** 🔍 Search Input **/
  searchInput: {
    height: 48,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginVertical: 12,
    backgroundColor: "#ffffff",
    fontSize: 15,
  },

  /** 📌 Delivery Type Filters **/
  deliveryTypeOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  deliveryTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  /** 📊 Sorting Options **/
  sortOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  activeButton: {
    backgroundColor: "#2563EB",
  },

  /** 🔽 Footer Section **/
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});