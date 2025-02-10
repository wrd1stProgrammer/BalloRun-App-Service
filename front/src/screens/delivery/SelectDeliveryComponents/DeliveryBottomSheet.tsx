import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { acceptActionHandler } from '../../../redux/actions/riderAction';
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import Geolocation from 'react-native-geolocation-service';
import { token_storage } from '../../../redux/config/storage';

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
};

type DeliveryBottomSheetProps = {
  deliveryItems: DeliveryItem[];
  loading: boolean;
};

function DeliveryBottomSheet({ deliveryItems, loading }: DeliveryBottomSheetProps): JSX.Element {
  const socket = useContext(MapSocketContext);
  const [tracking, setTracking] = useState(false);
  const dispatch = useAppDispatch();

  // 위치 추적 ID 저장 (해제할 때 필요)
  const [watchId, setWatchId] = useState<number | null>(null);

  // 배달 수락 함수
  const acceptHandler = async (orderId: string) => {
    try {
      const access_token = token_storage.getString('access_token');
      console.log(orderId, 'id logging');

      // 주문 수락 요청
      const dummyRes = await dispatch(acceptActionHandler(orderId));
      console.log(dummyRes);

      setTracking(true);
      
      // 서버에 트래킹 시작 요청
      socket?.emit('start_tracking', { orderId });

      // 위치 추적 시작
      const id = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket?.emit('update_location', { orderId, latitude, longitude });
          console.log("gps로 위치를 받아서 백으로 보냄")
          console.log(latitude)
          console.log(longitude)
        },
        (error) => {
          Alert.alert('위치 추적 오류', error.message);
        },
        { enableHighAccuracy: true, interval: 1000 } // 10m 이상 이동 시 or 5초마다 업데이트
      );
      console.log(id)
      setWatchId(id);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  // 위치 추적 정지 (필요한 경우)
  const stopTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

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
          onPress={() => acceptHandler(item._id)} 
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
    <BottomSheet snapPoints={['25%', '50%', '90%']}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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