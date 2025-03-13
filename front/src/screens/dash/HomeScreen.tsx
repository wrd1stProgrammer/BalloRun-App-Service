import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser, selectIsOngoingOrder, setOngoingOrder, setIsMatching, selectIsMatching, selectOngoingOrder, clearOngoingOrder, setIsOngoingOrder} from '../../redux/reducers/userSlice';
import { setupBackgroundNotifications, setupForegroundNotifications, onNotificationOpenedApp } from "../.././../src/utils/fcm/FcmHandler";
import { MapSocketContext } from '../../utils/sockets/MapSocket';
import { getDeliveryListHandler } from '../../redux/actions/orderAction';
import Geolocation from 'react-native-geolocation-service';
import { setWatchId } from '../../redux/reducers/locationSlice';
import Banner from './Banner/Banner';
import OrderListComponent from './Banner/OrderListComponent';
import MyAdBanner from './Banner/MyAdBanner';
import FixedOrderStatusBanner from './Banner/FixedOrderStatusBanner';
import NewFixedOrderStatusBanner from './Banner/NewFixedOrderStatusBanner';
import { WebSocketContext } from '../../utils/sockets/Socket';
import { useLocation } from '../../utils/Geolocation/LocationContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AdMobBanner from './AdMob/AdMobBanner';
import { refetchUser } from '../../redux/actions/userAction';

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

interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: string;
}

const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isOngoingOrder = useAppSelector(selectIsOngoingOrder);
  const ongoingOrder = useAppSelector(selectOngoingOrder);
  const isMatching = useAppSelector(selectIsMatching);
  const dispatch = useAppDispatch();
  const orderSocket = useContext(WebSocketContext);
  const socket = useContext(MapSocketContext);

  const { location, startTracking, stopTracking } = useLocation();

  // 🔥 FCM 알림 리스너 설정
  useEffect(() => {
    const foregroundListener = setupForegroundNotifications();
    setupBackgroundNotifications();
    onNotificationOpenedApp();
    return () => {
      foregroundListener();
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      //await dispatch(clearOngoingOrder());
      await dispatch(refetchUser());
      console.log("🚀 배달 상태 확인 중...");

      if (isOngoingOrder && isMatching && ongoingOrder) {
        console.log("🔥 배달 추적 시작!");
        socket?.emit("start_tracking", { orderId: ongoingOrder.orderId });
        console.log(`📌 Tracking started for order: ${ongoingOrder.orderId}`);
        startTracking(ongoingOrder.orderId);
      } else {
        console.log("⚠️ 배달 중인 주문 없음. 추적 중지.");
        stopTracking();
      }
    };

    fetchOrders();

    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (!orderSocket) {
      console.log("orderSocket error");
      return;
    }
    orderSocket.emit('join', user?._id);

    orderSocket.on('order_accepted', (orderData) => {
      console.log("order_accepted 이벤트 수신:", orderData);
      dispatch(setOngoingOrder(orderData));
      dispatch(setIsMatching(true));
    });

    orderSocket.on("order_completed", ({ orderId }) => {
      console.log(`✅ 주문자 화면: 배달 완료 감지 -> 주문 ID: ${orderId}`);
      dispatch(clearOngoingOrder());
      stopTracking();
    });

    orderSocket.on("emitCancel", ({ orderId, message, status }) => {
      console.log(`주문자 화면: 배달 캔슬 감지 -> 주문 ID: ${orderId}`);
      console.log(`주문 취소 사유: ${message}`);

      // includes로 배열 체크
        dispatch(clearOngoingOrder());
        alert(`주문이 취소되었습니다.\n주문 ID: ${orderId}\n사유: ${message}`);
        

    });

    return () => {
      orderSocket.off('order_accepted');
      orderSocket.off('order_completed');
      orderSocket.off("emitCancel");
      console.log('리스너정리');
    };
  }, [orderSocket, user?._id]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignContent: 'center' }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.greetingContainer}>
            <TouchableOpacity onPress={() => navigate('AddressSettingScreen')}>
              <Text style={styles.userName}>{user?.address || "주소를 설정하세요"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigate('KakaoSample')} style={styles.profileIconWrapper}>
            <Ionicons name="person-circle" size={36} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.bannerContainer}>
          <MyAdBanner />
        </View>
        <View style={styles.bannerContainer}>
          <Banner />
        </View>
        <OrderListComponent user={user} />
      </ScrollView>

      {isOngoingOrder && !isMatching && <FixedOrderStatusBanner />}
      {isOngoingOrder && isMatching && ongoingOrder && (
        console.log("NewFixedOrderStatusBanner 렌더링"),
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
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 15,
    marginTop: 15,
    alignItems: 'center',
  },
});