import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeliveryCustomMap from './SelectDeliveryComponents/DeliveryCustomMap';
import DeliveryBottomSheet from './SelectDeliveryComponents/DeliveryBottomSheet';
import DeliveryCustomList from './SelectDeliveryComponents/DeliveryCustomList';
import { getOrderData } from '../../redux/actions/riderAction';
import { useAppDispatch } from '../../redux/config/reduxHook';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';

const { height } = Dimensions.get("window");

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

function SelectDelivery() {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DeliveryItem[]>([]);
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<DeliveryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isListView, setIsListView] = useState(true);

  const mapRef = useRef<MapView | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const bottomAnim = useRef(new Animated.Value(height * 0.02)).current; // 초기 위치 (화면 높이의 2%)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData());
      setDeliveryItems(orders);
      setFilteredItems(orders);
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch, isListView]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);
      },
      (error) => {
        Alert.alert('위치 추적 오류', error.message);
      },
      { enableHighAccuracy: true, interval: 5000, distanceFilter: 10 }
    );
    setWatchId(watchId);
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        console.log("위치 추적 중지됨:", watchId);
      }
    };
  }, []);

  useEffect(() => {
    Animated.timing(bottomAnim, {
      toValue: selectedDeliveryItem ? height * 0.27 : height * 0.02,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedDeliveryItem]);

  const handleMarkerSelect = (item: DeliveryItem | any) => {
    setSelectedDeliveryItem(item);
  };

  const handleFilter = (type: string | null) => {
    if (type === "reservation") {
      setFilteredItems(deliveryItems.filter((item) => item.isReservation));
    } else if (type) {
      setFilteredItems(deliveryItems.filter((item) => item.deliveryType === type));
    } else {
      setFilteredItems(deliveryItems);
    }
    setSelectedDeliveryItem(null);
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
          <Text style={isListView ? styles.activeButtonText : styles.inactiveButtonText}>
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
          <Text style={!isListView ? styles.activeButtonText : styles.inactiveButtonText}>
            지도로 보기
          </Text>
        </TouchableOpacity>
      </View>

      {isListView ? (
        <DeliveryCustomList deliveryItems={deliveryItems} userLat={userLat} userLng={userLng} />
      ) : (
        <>
          <DeliveryCustomMap
            mapRef={mapRef}
            deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
            loading={loading}
            onMarkerSelect={handleMarkerSelect}
            onFilter={handleFilter}
            userLat={userLat}
            userLng={userLng}
            watchId={watchId}
            selectedLat={selectedDeliveryItem?.lat}
            selectedLng={selectedDeliveryItem?.lng}
          />
          {selectedDeliveryItem && (
            <DeliveryBottomSheet
              deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
              loading={loading}
              userLat={userLat}
              userLng={userLng}
              setUserLat={setUserLat}
              setUserLng={setUserLng}
              mapRef={mapRef}
            />
          )}
          <Animated.View style={[styles.gpsButton, { bottom: bottomAnim }]}>
            <TouchableOpacity
              onPress={() => {
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    latitude: userLat ?? 35.175570,
                    longitude: userLng ?? 126.907074,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }, 500);
                }
              }}
            >
              <FontAwesome name="location-arrow" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
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
  gpsButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  }
});

export default SelectDelivery;