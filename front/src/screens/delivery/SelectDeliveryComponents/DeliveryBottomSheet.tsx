import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert, Animated, Image } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { acceptActionHandler } from '../../../redux/actions/riderAction';
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import Geolocation from 'react-native-geolocation-service';
import { token_storage } from '../../../redux/config/storage';
import { Ionicons } from "@expo/vector-icons";
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';
import { navigate } from "../../../navigation/NavigationUtils";
import { useLocation } from '../../../utils/Geolocation/LocationContext';
import { refetchUser } from '../../../redux/actions/userAction';
import Cafe from "../../../assets/Icon/icon-coffee.png";
import Noodle from "../../../assets/Icon/icon-noodles.png";



const screenHeight = Dimensions.get('window').height; // 현재 디바이스 화면 높이

const snapPoints = ['30%', '30%', '35%'].map(percent => {
  return (parseFloat(percent) / 100) * screenHeight;
});

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


type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupholder" | any;
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder"; 
  orderDetails: string;
  images: string;
  orderImages: string;
};

type DeliveryBottomSheetProps = {
  deliveryItems: DeliveryItem[];
  loading: boolean;
  userLat: any;
  userLng: any;
  setUserLat: (lat: number) => void;
  setUserLng: (lng: number) => void;
  mapRef: React.RefObject<MapView>
};

function DeliveryBottomSheet({ mapRef,deliveryItems, loading, userLat, userLng, setUserLat, setUserLng }: DeliveryBottomSheetProps): JSX.Element {
  const socket = useContext(MapSocketContext);
  const [tracking, setTracking] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [trackingOrders, setTrackingOrders] = useState<Record<string, boolean>>({});
  
  // const { location, startTracking} = useLocation();

  // 위치 추적 ID 저장 (해제할 때 필요)
  const [watchId, setWatchId] = useState<number | null>(null);

  // GPS 버튼 애니메이션 값
  const animatedTop = useRef(new Animated.Value(80)).current;

  // 배달 수락 함수
  
  

const acceptHandler = async (orderId: string,  orderType: "Order" | "NewOrder") => {
  try {
    console.log(orderId,orderType,"id logging");

    // 주문 수락 요청
    const dummyRes = await dispatch(acceptActionHandler(orderId,orderType));
    

    setTrackingOrders((prev) => ({ ...prev, [orderId]: true }));

    // 서버에 트래킹 시작 요청
    // socket?.emit("start_tracking", { orderId });
    // startTracking(orderId);


    // 위치 추적 시작
    console.log("Geolocation.watchPosition 실행...");
    //await dispatch(refetchUser()); // isDelivering 상태 업뎃 위함.
 
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


  // 위치 추적 정지 (필요한 경우)
  // const stopTracking = () => {
  //   if (watchId !== null) {
  //     Geolocation.clearWatch(watchId);
  //     setWatchId(null);
  //     setTracking(false);
  //   }
  // };

// 배달 아이템 렌더링 함수 (신규)
const renderItem = ({ item }) => {
  const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng));
  const now = new Date();
  const endTime = new Date(item.endTime);
  const diff = endTime - now;
  const timeRemaining =
    diff <= 0
      ? "마감됨"
      : `${Math.floor(diff / (1000 * 60 * 60))}시간 ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}분 남음`;

  const typeInfo =
    item.deliveryType === "direct"
      ? { label: "직접 전달", icon: "walk" }
      : { label: "보관함", icon: "cube" };

  return (
    <View style={styles.cardContainer}>
      {/* 헤더(칩/카페명/가격-거리) */}
      <View style={styles.headerRow}>
        <View style={styles.tagChip}>
          <Ionicons name={typeInfo.icon} size={14} color="#3384FF" style={{ marginRight: 4 }} />
          <Text style={styles.tagText}>{typeInfo.label}</Text>
        </View>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="cash-outline" size={16} color="#667085" />
          <Text style={styles.metaText}>{item.deliveryFee.toLocaleString()}원</Text>
          <Ionicons name="location-outline" size={16} color="#667085" style={{ marginLeft: 10 }} />
          <Text style={styles.metaText}>{distance.toFixed(1)} km</Text>
        </View>
      </View>

      {/* 정보 행들 */}
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#667085" style={{ marginRight: 4 }} />
        <Text style={styles.infoLabel}>마감</Text>
        <Text style={styles.infoValue}>{timeRemaining}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="pin-outline" size={16} color="#667085" style={{ marginRight: 4 }} />
        <Text style={styles.infoLabel}>주소</Text>
        <Text style={styles.infoValue}>{item.address}</Text>
      </View>

      {/* 수락 버튼 */}
      <TouchableOpacity
        onPress={() => navigate("DeliveryDetail", { deliveryItem: item })}
        style={[
          styles.acceptBtn,
          (trackingOrders[item._id] || diff <= 0) && styles.disabledButton,
        ]}
        disabled={trackingOrders[item._id] || diff <= 0}
      >
        <Text style={styles.acceptText}>
          {diff <= 0 ? "마감" : trackingOrders[item._id] ? "배달 중..." : "수락하기"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <>
 

      {/* 바텀시트 */}
      <BottomSheet snapPoints={snapPoints}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <FlatList
              data={deliveryItems}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
            />
          )}
          

        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row", // 가로 정렬
    alignItems: "center", // 세로 중앙 정렬
    marginBottom: 12, // 아래 여백 추가
    justifyContent: "space-between", // 필요한 경우 양 끝 정렬
  },
  gpsButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#6C63FF",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  address: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryType: {
    fontSize: 14,
    color: '#495057',
  },
  time: {
    fontSize: 12,
    color: '#adb5bd',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6610f2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
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


  /** 🏷️ Delivery Item Card (NEW) **/
  cardContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: { marginBottom: 12 },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E6F0FF",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  tagText: { fontSize: 12, color: "#3384FF", fontWeight: "600" },
  cafeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  metaText: { fontSize: 14, color: "#475467", marginLeft: 4 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  infoLabel: { fontSize: 14, color: "#667085", marginRight: 6, minWidth: 44 },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    flexShrink: 1,
  },

  acceptBtn: {
    backgroundColor: "#3384FF",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 14,
  },
  acceptText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  disabledButton: { backgroundColor: "#A0AEC0" },
 


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

  deliveryTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  /** 📊 Sorting Options **/

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

});

export default DeliveryBottomSheet;