import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser } from '../../redux/reducers/userSlice';
import { setupBackgroundNotifications, setupForegroundNotifications, onNotificationOpenedApp } from "../.././../src/utils/fcm/FcmHandler";
import { MapSocketContext } from '../../utils/sockets/MapSocket';
import { getDeliveryListHandler } from '../../redux/actions/orderAction';
import Geolocation from 'react-native-geolocation-service';
import { setWatchId } from '../../redux/reducers/locationSlice';

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
  status: string;
};

const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const socket = useContext(MapSocketContext);

  const watchId = useAppSelector((state) => state.location.watchId);

  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 FCM 알림 리스너 설정
  useEffect(() => {
    const foregroundListener = setupForegroundNotifications();
    setupBackgroundNotifications();
    onNotificationOpenedApp();
    return () => {
      foregroundListener(); // 리스너 정리
    };
  }, []);

  // ✅ 배달 리스트 가져오기 & "accepted" 상태의 주문 추적 시작
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getDeliveryListHandler());
      setDeliveryItems(orders);
      setLoading(false);
  
      const acceptedOrders = orders.filter((order: DeliveryItem) =>
        ["accepted", "delivered", "goToCafe", "goToClient", "makingMenu"].includes(order.status)
      );
  
      console.log("📢 현재 Redux의 watchId 상태:", watchId);
  
      if (acceptedOrders.length > 0) {
        console.log("🚀 배달 중인 주문 발견:", acceptedOrders);
  
        acceptedOrders.forEach((order) => {
          socket?.emit("start_tracking", { orderId: order._id });
          console.log(`Tracking started for order: ${order._id}`);
        });
  
        if (!watchId) {
          console.log("LOG  Geolocation.watchPosition 실행...");
          const id = Geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
  
              console.log(`LOG  위치 업데이트: ${latitude} ${longitude}`);
  
              acceptedOrders.forEach((order) => {
                socket?.emit("update_location", { orderId: order._id, latitude, longitude });
              });
            },
            (error) => {
              Alert.alert("위치 추적 오류", error.message);
            },
            { enableHighAccuracy: true, interval: 5000, distanceFilter: 20 }
          );
  
          console.log("LOG  위치 추적 시작, watchId:", id);
          dispatch(setWatchId(id)); // Redux에 저장
        }
      } else {
        console.log("배달 중인 주문 없음");
  
        if (watchId !== null && watchId !== undefined) {
          console.log("🚨 위치 추적 중지 시도 (watchId 존재)", watchId);
          Geolocation.clearWatch(watchId);
          dispatch(setWatchId(null));
          console.log("✅ 위치 추적 중지 완료");
          socket?.emit("stop_tracking", {});
        }
      }
    };
  
    fetchOrders();
  
    return () => {
      console.log("🚨 HomeScreen Unmount 시 Redux watchId 상태:", watchId);
      if (watchId !== null && watchId !== undefined) {
        Geolocation.clearWatch(watchId);
        dispatch(setWatchId(null));
        socket?.emit("stop_tracking", {});
      }
    };
  }, []); 

  return (
    <View style={styles.container}>
      {/* 상단 프로필/인사 문구 영역 */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.userName}>{user?.username}님, 안녕하세요!!!!</Text>
          <Text>캠퍼스 커피에서 편함을 주문해보세요.</Text>
        </View>
        {/* 프로필 아이콘 */}
        <TouchableOpacity onPress={() => navigate('KakaoSample')} style={styles.profileIconWrapper}>
          <Ionicons name="person-circle" size={36} color="#999" />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠: 2개의 카드 */}
      <View style={styles.cardList}>
        {/* 배달하기 카드 */}
        <TouchableOpacity style={[styles.card, styles.deliveryCard]} onPress={() => navigate('SelectDelivery')}>
          <Ionicons name="bicycle" size={28} color="#fff" />
          <Text style={styles.cardTextWhite}>배달하기</Text>
        </TouchableOpacity>

        {/* 주문하기 카드 */}
        <TouchableOpacity style={[styles.card, styles.orderCard]} onPress={() => navigate('OrderListScreen')}>
          <Ionicons name="restaurant" size={28} color="#8A67F8" />
          <Text style={styles.cardTextDark}>주문하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardList: {},
  card: {
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryCard: {
    backgroundColor: '#8A67F8',
    shadowColor: '#8A67F8',
    justifyContent: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8A67F8',
    justifyContent: 'center',
  },
  cardTextWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  cardTextDark: {
    color: '#8A67F8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});