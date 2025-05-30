import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView,Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeliveryCustomMap from './SelectDeliveryComponents/DeliveryCustomMap';
import DeliveryBottomSheet from './SelectDeliveryComponents/DeliveryBottomSheet';
import DeliveryCustomList from './SelectDeliveryComponents/DeliveryCustomList';
import { getOrderData } from '../../redux/actions/riderAction';
import { useAppDispatch } from '../../redux/config/reduxHook';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';

const { height,width } = Dimensions.get("window");


type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupholder" | any;
  startTime: string;
  deliveryFee: number;
  riderRequest: string;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string
  isReservation: boolean;
  orderType: "Order" | "NewOrder"; 
  orderDetails: string;
  images: string;
  orderImages: string;
};

function SelectDelivery() {
  const tabIndicator = useRef(new Animated.Value(0)).current;
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
  const bottomAnim = useRef(new Animated.Value(height * 0.01)).current; // 초기 위치 (화면 높이의 2%)

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: isListView ? 0 : width / 2, // 리스트 → 0, 지도 → width 절반만큼 이동
      useNativeDriver: false,
    }).start();
  }, [isListView]);

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
        <SafeAreaView style={styles.container}>
    
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            
          ]}
          onPress={() => setIsListView(true)}
        >
          <Text style={styles.toggleButtonText}>
            리스트로 보기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
                      ]}
          onPress={() => setIsListView(false)}
        >
          <Text style={styles.toggleButtonText}>
            지도로 보기
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.underline, { transform: [{ translateX: tabIndicator }] }]} />

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
        </>
      )}
          {!isListView && (
            <Animated.View style={[styles.gpsButton, { bottom: bottomAnim }]}>
              <TouchableOpacity
                style={styles.gpsTouchable}
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
                activeOpacity={0.7}
              >
                <FontAwesome name="location-arrow" size={18} color="#3384FF" />
                <Text style={styles.gpsText}>내 위치</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          </SafeAreaView>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  underline: {
    position: "absolute",
    bottom: -2, // 살짝 아래로 위치 조정
    left: 0,
    width: "50%",
    height: 2,
    backgroundColor: "black",
  },
  gpsButton: {
    position: 'absolute',
    right: 18,
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 18,
    elevation: 10,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  gpsTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  gpsText: {
    fontSize: 13,
    color: '#3384FF',
    fontWeight: '600',
    marginLeft: 6,
  },
  
});

export default SelectDelivery;