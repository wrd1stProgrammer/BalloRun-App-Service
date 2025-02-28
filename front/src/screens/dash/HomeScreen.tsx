import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser, selectIsOngoingOrder, setOngoingOrder, setIsMatching, selectIsMatching, selectOngoingOrder, clearOngoingOrder, setIsOngoingOrder } from '../../redux/reducers/userSlice';
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

// 주문 상태 인터페이스
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
  const orderSocket = useContext(WebSocketContext); // WebSocketContext에서 소켓 가져오기
  const socket = useContext(MapSocketContext);



  const { location, startTracking, stopTracking } = useLocation();

  
  


  // 🔥 FCM 알림 리스너 설정
  useEffect(() => {
    
    const foregroundListener = setupForegroundNotifications();
    setupBackgroundNotifications();
    onNotificationOpenedApp();
    return () => {
      foregroundListener(); // 리스너 정리
    };
  }, []);


  useEffect(() => {

    const fetchOrders = async () => {
      await dispatch(refetchUser());
      //dispatch(clearOngoingOrder());

      //await dispatch(setIsOngoingOrder(false));
      console.log("🚀 배달 상태 확인 중...");

  
        // ✅ isOngoingOrder && isMatching && ongoingOrder 조건이 참일 때만 실행
        if (isOngoingOrder && isMatching && ongoingOrder) {
          console.log("🔥 배달 추적 시작!");
  
          
            socket?.emit("start_tracking", { orderId: ongoingOrder.orderId });
            console.log(`📌 Tracking started for order: ${ongoingOrder.orderId}`);
            startTracking(ongoingOrder.orderId);
          
        }
       else {
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
    orderSocket.emit('join', user?._id); // 방 조인 시도
    orderSocket.on('order_accepted', (orderData) => {
      console.log("order_accepted 이벤트 수신:", orderData);
      dispatch(setOngoingOrder(orderData));
      dispatch(setIsMatching(true));
   });
  
   orderSocket.on("order_completed", ({ orderId }) => {
    console.log(`✅ 주문자 화면: 배달 완료 감지 -> 주문 ID: ${orderId}`);
    dispatch(clearOngoingOrder()); // Redux 상태 초기화 -> 배너 삭제
    stopTracking()
  });

  orderSocket.on("emitCancel", ({ orderId, message,status }) => {
    console.log(`주문자 화면: 배달 캔슬 감지 -> 주문 ID: ${orderId}`);
    console.log(`주문 취소 사유: ${message}`);

    dispatch(clearOngoingOrder());

    alert(`주문이 취소되었습니다. \n주문 ID: ${orderId}\n사유: ${message}`);
  });
    //return () => {
    //  orderSocket.off('order_accepted');
    //};
  }, [orderSocket]); // 의존성에 user?._id 추가



  return (
    <View style={{ flex: 1 }}>
<ScrollView
      style={styles.container}
      contentContainerStyle={{ alignContent: 'center' }}
    >
        {/* 상단 프로필/인사 문구 영역 */}
        <View style={styles.headerContainer}>
          <View style={styles.greetingContainer}>
            <Text style={styles.userName}>북구 용주로 30번길 88</Text>
          </View>
          {/* 프로필 아이콘 */}
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




        <View style={styles.bannerContainer}>
          <AdMobBanner/>
        </View>
        

      </ScrollView>

      
      {/* isOngoingOrder가 true이고 isMatching이 false일 때 기존 배너 */}
      {isOngoingOrder && !isMatching && <FixedOrderStatusBanner />}
      
      {/* isOngoingOrder와 isMatching이 모두 true일 때 새로운 배너 */}
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
    //width: '100%',
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
    alignItems: 'center', // 배너를 수평으로 중앙에 정렬
  },
});