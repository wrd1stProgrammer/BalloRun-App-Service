import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native'; // SafeAreaView 추가
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser, selectIsOngoingOrder, setOngoingOrder, setIsMatching, selectIsMatching, selectOngoingOrder, clearOngoingOrder, setIsOngoingOrder } from '../../redux/reducers/userSlice';
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

const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isOngoingOrder = useAppSelector(selectIsOngoingOrder);
  const ongoingOrder = useAppSelector(selectOngoingOrder);
  const isMatching = useAppSelector(selectIsMatching);
  const dispatch = useAppDispatch();
  const orderSocket = useContext(WebSocketContext);
  const socket = useContext(MapSocketContext);
  const { location, startTracking, stopTracking } = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(clearOngoingOrder());
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
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ alignContent: 'center' }}
        >
          <View style={styles.headerContainer}>
            <View style={styles.greetingContainer}>
              <TouchableOpacity onPress={() => navigate('AddressSettingScreen')}>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {user?.address?.length > 20 ? `${user.address.slice(0, 20)}...` : user?.address || "주소를 설정하세요"} ▼
              </Text>
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

          {/* 추가된 텍스트 섹션 */}
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>
              SERN | 사업자등록번호 418-11-83101
            </Text>
            <Text style={styles.footerText}>
              전자금융분쟁처리 Tel 1600-0987(유료), 080-849-0987(무료)
            </Text>
            <Text style={styles.footerText}>
              발로뛰어는 통신판매중개자로 거래 당사자가 아니므로, 소비자가 등록한 상품 정보 및 거래에 대해 발로뛰어는 책임을 지지 않습니다.
            </Text>
          </View>
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
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 0, // 기존 50에서 0으로 변경하여 SafeAreaView가 자동 조정
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
  footerTextContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
});