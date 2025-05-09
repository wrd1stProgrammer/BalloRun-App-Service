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
import DeliveryDetailModal from '../DeliveryDetailComponents/DeliveryDetailModal';
import { useLocation } from '../../../utils/Geolocation/LocationContext';
import { refetchUser } from '../../../redux/actions/userAction';
import Cafe from "../../../assets/Icon/icon-coffee.png";
import Noodle from "../../../assets/Icon/icon-noodles.png";



const screenHeight = Dimensions.get('window').height; // 현재 디바이스 화면 높이

const snapPoints = ['25%', '30%', '35%'].map(percent => {
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

  // 배달 아이템 렌더링 함수
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
          <DeliveryDetailModal visible={modalVisible} onClose={closeModal} onAccept={handleAccept} deliveryItem={selectedItem} />

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
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
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
  disabledButton: {
    backgroundColor: '#bbb',
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
 
  info: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 3,
  },


  /** ✅ Right Section (Accept Button) **/
  rightSection: {
    justifyContent: "center",

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