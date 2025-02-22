import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { token_storage } from "../../../redux/config/storage";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { acceptActionHandler } from "../../../redux/actions/riderAction";
import Geolocation from 'react-native-geolocation-service';
import { navigate } from "../../../navigation/NavigationUtils";
import DeliveryDetailModal from "../DeliveryDetailComponents/DeliveryDetailModal";
import { useLocation } from "../../../utils/Geolocation/LocationContext";

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupholder" | any; // 🔥 배달 유형 추가
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
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
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<"all" | "direct" | "cupholder">("all");
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



// const getCurrentLocation = (orderId): Promise<{ latitude: number; longitude: number }> => {
//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("현재 위치 받아옴:", latitude, longitude);
//         resolve({ latitude, longitude });
//         socket?.emit("update_location", { orderId, latitude, longitude });

//       },
//       (error) => {
//         console.error("위치 가져오기 실패:", error);
//         reject(error);
//       },
//       { enableHighAccuracy: true }
//     );
//   });
// };


// const acceptHandler = async (orderId: string,  orderType: "Order" | "NewOrder") => {
//   try {
//     console.log(orderId,orderType,"id logging");

//     // 주문 수락 요청
//     const dummyRes = await dispatch(acceptActionHandler(orderId,orderType));
//     //console.log(dummyRes);
    

//     setTrackingOrders((prev) => ({ ...prev, [orderId]: true }));

//     // 서버에 트래킹 시작 요청
//     socket?.emit("start_tracking", { orderId });
//     const location = await getCurrentLocation(orderId);

//     // 위치 추적 시작
//     console.log("Geolocation.watchPosition 실행...");
//     const id = Geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         socket?.emit("update_location", { orderId, latitude, longitude });
//         console.log("위치 업데이트:", latitude, longitude);
//       },
//       (error) => {
//         console.log("위치 추적 오류:", error);
//         Alert.alert("위치 추적 오류", error.message);
//       },
//       { enableHighAccuracy: true, interval: 1000 }
//     );

//     console.log("위치 추적 시작, watchId:", id);

//     setTimeout(() => {
//       console.log("Navigating to BottomTab...");
//       navigate("BottomTab", {
//         screen: "DeliveryRequestListScreen",
//       });
//     }, 1500);
//   } catch (error) {
//     console.error("Error accepting order:", error);
//   }
// };



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

  const renderItem = ({ item }: { item: DeliveryItem }) => {
    const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng)).toFixed(1);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.cafeName}>{item.items[0].cafeName}</Text>
          <Text style={styles.menu}>{item.items.map(i => `${i.menuName} x${i.quantity}`).join(", ")}</Text>
          <Text style={styles.info}>{item.deliveryType === "direct" ? "직접 배달" : "컵홀더 배달"}</Text>
          <Text style={styles.info}>거리: {distance} km</Text>
          <Text style={styles.price}>배달비: {item.deliveryFee}원</Text>
          <Text style={styles.price}>가격: {item.price}원</Text>
          <Text style={styles.price}>
  종료: {
    (() => {
      const now = new Date();
      const endTime = new Date(item.endTime);
      const diff = endTime - now; // 밀리초 차이

      if (diff <= 0) return "종료됨"; // 이미 종료된 경우

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours}시간 ${minutes}분 ${seconds}초 남음`;
    })()
  }
</Text>
        </View>
        <View style={styles.footer}>
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
      <View style={styles.deliveryTypeOptions}>
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

      {/* 3️⃣ 정렬 옵션 버튼 */}
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
      </View>

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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  deliveryTypeOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  deliveryTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e5e7eb",
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e5e7eb",
  },
  activeButton: {
    backgroundColor: "#6C63FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sortText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  cafeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menu: {
    fontSize: 14,
    color: "#4B5563",
    marginVertical: 4,
  },
  info: {
    fontSize: 12,
    color: "#6B7280",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    color: "#6C63FF",
  },
  button: {
    backgroundColor: '#6610f2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
});