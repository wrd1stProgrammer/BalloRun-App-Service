import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert, Animated } from 'react-native';
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



const screenHeight = Dimensions.get('window').height; // 현재 디바이스 화면 높이

const snapPoints = ['25%', '30%', '35%'].map(percent => {
  return (parseFloat(percent) / 100) * screenHeight;
});



type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string;
  startTime: string;
  deliveryFee: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  orderType: "Order" | "NewOrder"
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
  

  // 위치 추적 ID 저장 (해제할 때 필요)
  const [watchId, setWatchId] = useState<number | null>(null);

  // GPS 버튼 애니메이션 값
  const animatedTop = useRef(new Animated.Value(80)).current;

  // 배달 수락 함수


const getCurrentLocation = (orderId): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("현재 위치 받아옴:", latitude, longitude);
        resolve({ latitude, longitude });
        socket?.emit("update_location", { orderId, latitude, longitude });

      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
};


const acceptHandler = async (orderId: string,  orderType: "Order" | "NewOrder") => {
  try {
    console.log(orderId,orderType,"id logging");

    // 주문 수락 요청
    const dummyRes = await dispatch(acceptActionHandler(orderId,orderType));
    //console.log(dummyRes);
    

    setTrackingOrders((prev) => ({ ...prev, [orderId]: true }));

    // 서버에 트래킹 시작 요청
    socket?.emit("start_tracking", { orderId });
    const location = await getCurrentLocation(orderId);

    // 위치 추적 시작
    console.log("Geolocation.watchPosition 실행...");
    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket?.emit("update_location", { orderId, latitude, longitude });
        console.log("위치 업데이트:", latitude, longitude);
      },
      (error) => {
        console.log("위치 추적 오류:", error);
        Alert.alert("위치 추적 오류", error.message);
      },
      { enableHighAccuracy: true, interval: 1000 }
    );

    setWatchId(id);
    console.log("위치 추적 시작, watchId:", id);

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

  // 현재 위치 업데이트
  const updateUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }


      },
      (error) => {
        Alert.alert("위치 갱신 오류", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // 위치 추적 정지 (필요한 경우)
  const stopTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  // // 바텀시트 이동 시 GPS 버튼을 반대로 움직이도록 설정
  // const handleSheetChange = (index: number) => {
  //   const positions = snapPoints.map(point => screenHeight - point); // 바텀시트 높이와 반대 값 설정
  //   const adjustedTop = positions[index] + screenHeight * -0.10; // 바텀시트보다 약간 위에서 유지 (5% 여유)
  
  //   Animated.timing(animatedTop, {
  //     toValue: adjustedTop,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // };

  // 배달 아이템 렌더링 함수
  const renderItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName || '카페 이름'}</Text>
      </View>
      <Text style={styles.address}>{item.address || '배달 주소'}</Text>
      <View style={styles.cardBody}>
        <Text style={styles.deliveryType}>{item.deliveryType || '배달 유형'}</Text>
        <Text style={styles.time}>{new Date(item.endTime).toLocaleTimeString()} 만료 시간</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => acceptHandler(item._id, item.orderType )} 
          style={[styles.button, tracking && styles.disabledButton]}
          disabled={tracking}
        >
          <Text style={styles.buttonText}>{tracking ? "배달 중..." : "수락하기"}</Text>
        </TouchableOpacity>
        <Text style={styles.price}>{item.deliveryFee.toLocaleString()}원</Text>
      </View>
    </View>
  );

  return (
    <>
 

      {/* 바텀시트 */}
      <BottomSheet snapPoints={snapPoints}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#6610f2" />
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
});

export default DeliveryBottomSheet;