import React, { useEffect, useState } from 'react';
import DeliveryCustomMap from './SelectDeliveryComponents/DeliveryCustomMap';
import DeliveryBottomSheet from './SelectDeliveryComponents/DeliveryBottomSheet';
import { getOrderData } from '../../redux/actions/riderAction';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeliveryCustomList from './SelectDeliveryComponents/DeliveryCustomList';
import Geolocation from 'react-native-geolocation-service';

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
};

function SelectDelivery() {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]); // 전체 주문 데이터
  const [filteredItems, setFilteredItems] = useState<DeliveryItem[]>([]); // 필터링된 주문 데이터
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<DeliveryItem | null>(null); // 선택된 주문
  const [loading, setLoading] = useState<boolean>(true);
  const [isListView, setIsListView] = useState(true); // 리스트/지도 전환 상태


  const [userLat, setUserLat] = useState<number>(0);
  const [userLng, setUserLng] = useState<number>(0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData());
      setDeliveryItems(orders);
      setFilteredItems(orders); // 초기 상태는 전체 주문 표시
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch,isListView]);


  useEffect(() => {
    //  현재 위치 추적 시작
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);
      },
      (error) => {
        Alert.alert('위치 추적 오류', error.message);
      },
      { enableHighAccuracy: true, interval: 5000, distanceFilter: 10 } // 5초마다 또는 10m 이동 시 업데이트
    );
  
    // 메모리 누수 방지를 위해 언마운트 시 위치 추적 해제
  }, []);


  const handleMarkerSelect = (item: DeliveryItem | any) => {
    setSelectedDeliveryItem(item); // 선택된 주문 설정
  };

  const handleFilter = (type: string | null) => {
    if (type === "reservation") {
      // 예약 주문 필터링
      setFilteredItems(deliveryItems.filter((item) => item.isReservation));
    } else if (type) {
      // 특정 필터 적용
      setFilteredItems(deliveryItems.filter((item) => item.deliveryType === type));
    } else {
      // 필터 해제 (전체 보기)
      setFilteredItems(deliveryItems);
    }
    setSelectedDeliveryItem(null); // 선택된 주문 초기화
  };



  return (
    <>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isListView ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsListView(true)}
        >
          <Text
            style={isListView ? styles.activeButtonText : styles.inactiveButtonText}
          >
            리스트로 보기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isListView ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsListView(false)}
        >
          <Text
            style={!isListView ? styles.activeButtonText : styles.inactiveButtonText}
          >
            지도로 보기
          </Text>
        </TouchableOpacity>
      </View>

      {isListView ? (
        <DeliveryCustomList
        deliveryItems={deliveryItems}
        userLat={userLat}  
        userLng={userLng}  
        />
      ) : (
        <>
        <DeliveryCustomMap
        deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
        loading={loading}
        onMarkerSelect={handleMarkerSelect}
        onFilter={handleFilter} // 필터 핸들러 전달
        userLat={userLat}
        userLng={userLng}
      />
      <DeliveryBottomSheet
        deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
        loading={loading}
        userLat={userLat}
        userLng={userLng}
      />
      </>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#6C63FF",
  },
  inactiveButton: {
    backgroundColor: "#E5E7EB",
  },
  activeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inactiveButtonText: {
    color: "#6B7280",
  },
});

export default SelectDelivery;
