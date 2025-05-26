/**
 * DeliveryDetail.tsx
 * - iOS/Android 안전 영역 맞춤 헤더·버튼
 * - Android에서도 Callout 썸네일 보이도록 tooltip 분기
 * - react-native-image-viewing + Callout 자동 닫기
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import ImageViewing from "react-native-image-viewing";

import { acceptActionHandler } from "../../../redux/actions/riderAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { navigate, goBack } from "../../../navigation/NavigationUtils";
import DeliveryDetailBottomSheet from "./DeliveryDetailBottomSheet";
import { useAppDispatch } from "../../../redux/config/reduxHook";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
type DeliveryItem = {
  _id: string;
  name: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: "direct" | "cupHolder";
  startTime: string;
  deliveryFee: number;
  price: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  resolvedAddress: string;
  isReservation: boolean;
  orderType: "Order" | "NewOrder";
  riderRequest: string;
  images: string;
  orderImages: string;
};

type RouteParams = {
  DeliveryDetail: { deliveryItem: DeliveryItem };
};

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */
const DeliveryDetail: React.FC = () => {
  const insets = useSafeAreaInsets(); // 안전 영역
  const route = useRoute<RouteProp<RouteParams, "DeliveryDetail">>();
  const { deliveryItem } = route.params;
  if (!deliveryItem) return null;

  /* refs */
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<Marker>(null);

  /* state */
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  /* redux */
  const dispatch = useAppDispatch();

  /* geolocation */
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        const dist = getDistance(
          { latitude, longitude },
          { latitude: +deliveryItem.lat, longitude: +deliveryItem.lng }
        );
        setDistance(dist);
      },
      (err) => console.log("geo err:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  /* accept */
  const acceptHandler = async () => {
    try {
      await dispatch(acceptActionHandler(deliveryItem._id, deliveryItem.orderType));
      dispatch(setIsOngoingOrder(true));
      setTimeout(() => navigate("BottomTab", { screen: "DeliveryRequestListScreen" }), 1500);
    } catch (e) {
      console.error("accept error:", e);
    }
  };

  /* callout / viewer */
  const openViewer = () => {
    markerRef.current?.hideCallout();
    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
    markerRef.current?.hideCallout();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 뒤로가기 */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={goBack}
      >
        <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
      </TouchableOpacity>

      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: +deliveryItem.lat,
          longitude: +deliveryItem.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 주문지 마커 */}
        <Marker
          ref={markerRef}
          coordinate={{ latitude: +deliveryItem.lat, longitude: +deliveryItem.lng }}
        >
          <Callout
            tooltip={Platform.OS === "ios"} // iOS만 tooltip
            onPress={openViewer}
          >
            {deliveryItem.orderImages ? (
              <TouchableOpacity activeOpacity={0.85} onPress={openViewer}>
                <Image source={{ uri: deliveryItem.orderImages }} style={styles.calloutImage} />
              </TouchableOpacity>
            ) : (
              <Text>이미지 없음</Text>
            )}
          </Callout>
        </Marker>

        {/* 내 위치 */}
        {userLat && userLng && (
          <Marker
            coordinate={{ latitude: userLat, longitude: userLng }}
            title="내 위치"
            pinColor="blue"
          />
        )}
      </MapView>

      {/* 현재 위치 버튼 */}
      <TouchableOpacity
        style={[styles.currentLocationButton, { top: insets.top + 50 }]}
        onPress={() => {
          if (userLat && userLng) {
            mapRef.current?.animateToRegion({
              latitude: userLat,
              longitude: userLng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
      >
        <Ionicons name="navigate" size={24} color="#000" />
      </TouchableOpacity>

      {/* 바텀시트 */}
      <DeliveryDetailBottomSheet
        deliveryItem={deliveryItem}
        distance={distance ?? undefined}
        onAccept={acceptHandler}
      />

      {/* 이미지 뷰어 */}
      <ImageViewing
        images={[{ uri: deliveryItem.orderImages }]}
        imageIndex={0}
        visible={viewerVisible}
        onRequestClose={closeViewer}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        presentationStyle="fullScreen"
      />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 12,
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  currentLocationButton: {
    position: "absolute",
    right: 25,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  calloutImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default DeliveryDetail;
