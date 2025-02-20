import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser, selectIsOngoingOrder } from '../../redux/reducers/userSlice';
import { setupBackgroundNotifications, setupForegroundNotifications, onNotificationOpenedApp } from "../.././../src/utils/fcm/FcmHandler";
import { MapSocketContext } from '../../utils/sockets/MapSocket';
import { getDeliveryListHandler } from '../../redux/actions/orderAction';
import Geolocation from 'react-native-geolocation-service';
import { setWatchId } from '../../redux/reducers/locationSlice';
import Banner from './Banner/Banner';
import OrderListComponent from './Banner/OrderListComponent';
import MyAdBanner from './Banner/MyAdBanner';
import FixedOrderStatusBanner from './Banner/FixedOrderStatusBanner'; // 기존 배너
import NewFixedOrderStatusBanner from './Banner/NewFixedOrderStatusBanner'; // 새로운 배너
import { WebSocketContext } from '../../utils/sockets/Socket';
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

// 주문 상태 인터페이스
interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isOngoingOrder = useAppSelector(selectIsOngoingOrder);
  const dispatch = useAppDispatch();
  const orderSocket = useContext(WebSocketContext); // WebSocketContext에서 소켓 가져오기
  const socket = useContext(MapSocketContext);

  const watchId = useAppSelector((state) => state.location.watchId);

  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ongoingOrder, setOngoingOrder] = useState<OrderStatus | null>(null); // 진행 중인 주문 상태
  const [isMatching, setIsMatching] = useState<boolean>(false); // 매칭 상태

  const CheckIsDelivering = () => {
    if (user?.isDelivering) {
      Alert.alert('배달 중', '현재 이미 배달 중입니다.');
    } else {
      navigate("SelectDelivery");
    }
  };

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
        //console.log("🚀 배달 중인 주문 발견:", acceptedOrders);
  
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
        //console.log("배달 중인 주문 없음");
  
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

  useEffect(() => {
    if (!orderSocket) {
      console.log("orderSocket error");
      return;
    }
  
    console.log("소켓 연결 상태:", orderSocket.connected); // 연결 상태 확인
    orderSocket.emit('join', user?._id); // 방 조인 시도
    console.log(`${user?._id} 방에 조인 시도`);
  
    orderSocket.on('order_accepted', (orderData) => {
      console.log("order_accepted 이벤트 수신:", orderData);
      setOngoingOrder(orderData);
      setIsMatching(true);
    });
  
    return () => {
      orderSocket.off('order_accepted');
    };
  }, [orderSocket, user?._id]); // 의존성에 user?._id 추가

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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

        {/* 근처 배달가능 리스트 */}
        <View style={styles.bannerContainer}>
          <Banner />
        </View>
        
        <OrderListComponent user={user} />

        <View style={styles.bannerContainer}>
          <MyAdBanner />
        </View>
        
        <View style={styles.bannerContainer}>
          <MyAdBanner />
        </View>
      </ScrollView>
      
      {/* isOngoingOrder가 true이고 isMatching이 false일 때 기존 배너 */}
      {isOngoingOrder && !isMatching && <FixedOrderStatusBanner />}
      
      {/* isOngoingOrder와 isMatching이 모두 true일 때 새로운 배너 */}
      {isOngoingOrder && isMatching && ongoingOrder && (
        <NewFixedOrderStatusBanner 
          order={ongoingOrder} 
          isOngoingOrder={isOngoingOrder} 
          isMatching={isMatching} 
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    margin: 15,
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
  bannerContainer: {
    marginBottom: 20,
  },
});