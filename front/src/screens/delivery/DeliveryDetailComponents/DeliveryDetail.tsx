/**
 * DeliveryDetail.tsx
 * react-native-image-viewing + Callout 자동 닫기
 */
import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { getDistance } from "geolib";
import ImageViewing from "react-native-image-viewing";

import { acceptActionHandler } from "../../../redux/actions/riderAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { navigate, goBack } from "../../../navigation/NavigationUtils";
import DeliveryDetailBottomSheet from "./DeliveryDetailBottomSheet";
import { useAppDispatch } from "../../../redux/config/reduxHook";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
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
  DeliveryDetail: {
    deliveryItem: DeliveryItem;
  };
};

/* -------------------------------------------------------------------------- */
/*                              DeliveryDetail                                */
/* -------------------------------------------------------------------------- */
const DeliveryDetail: React.FC = () => {
  /* ----------------------------- Nav & Params ----------------------------- */
  const route = useRoute<RouteProp<RouteParams, "DeliveryDetail">>();
  const { deliveryItem } = route.params;
  if (!deliveryItem) return null;

  /* ------------------------------ Local State ----------------------------- */
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<Marker>(null);           // ★ 마커 ref
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  /* ------------------------------ Redux Hook ------------------------------ */
  const dispatch = useAppDispatch();

  /* ----------------------------- Geolocation ------------------------------ */
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

  /* --------------------------- Accept Order Flow -------------------------- */
  const acceptHandler = async (orderId: string, orderType: "Order" | "NewOrder") => {
    try {
      await dispatch(acceptActionHandler(orderId, orderType));
      dispatch(setIsOngoingOrder(true));
      setTimeout(() => navigate("BottomTab", { screen: "DeliveryRequestListScreen" }), 1500);
    } catch (e) {
      console.error("accept error:", e);
    }
  };

  /* ----------------------------- Callout 제어 ----------------------------- */
  const openViewer = () => {
    // Callout 닫고(=미리보기 사라짐) -> 뷰어 표시
    markerRef.current?.hideCallout();
    setViewerVisible(true);
  };

  const closeViewer = () => {
    setViewerVisible(false);
    // 혹시 남아 있을 수도 있으니 한 번 더 hide
    markerRef.current?.hideCallout();
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <View style={{ flex: 1 }}>
      {/* ---------- 뒤로가기 ---------- */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
      </TouchableOpacity>

      {/* ---------- 지도 ---------- */}
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
          ref={markerRef}   // ★ ref 연결
          coordinate={{ latitude: +deliveryItem.lat, longitude: +deliveryItem.lng }}
          title={deliveryItem.items[0].menuName}
          description={deliveryItem.address}
        >
          <Callout tooltip onPress={openViewer}>
            {deliveryItem.orderImages ? (
              <TouchableOpacity activeOpacity={0.85} onPress={openViewer}>
                <Image source={{ uri: deliveryItem.orderImages }} style={styles.calloutImage} />
              </TouchableOpacity>
            ) : (
              <Text>이미지 없음</Text>
            )}
          </Callout>
        </Marker>

        {/* 내 위치 마커 */}
        {userLat && userLng && (
          <Marker
            coordinate={{ latitude: userLat, longitude: userLng }}
            title="내 위치"
            pinColor="blue"
          />
        )}
      </MapView>

      {/* ---------- 현재 위치 이동 버튼 ---------- */}
      <TouchableOpacity
        style={styles.currentLocationButton}
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

      {/* ---------- 상세 바텀시트 ---------- */}
      <DeliveryDetailBottomSheet
        deliveryItem={deliveryItem}
        distance={distance ?? undefined}
        onAccept={() => acceptHandler(deliveryItem._id, deliveryItem.orderType)}
      />

      {/* ---------- 전체 화면 이미지 뷰어 ---------- */}
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
/*                                    Style                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  currentLocationButton: {
    position: "absolute",
    top: 70,
    right: 25,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButton: {
    position: "absolute",
    marginTop: 16,
    top: 48,
    left: 12,
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  calloutImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default DeliveryDetail;
