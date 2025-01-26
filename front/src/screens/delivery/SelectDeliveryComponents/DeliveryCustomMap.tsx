import React from "react";
import MapView, { Marker } from "react-native-maps";

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string; // 배달 주소
  deliveryType: string; // 배달 유형
  startTime: string; // 주문 시작 시간
  deliveryFee: number; // 배달비
  cafeLogo: string; // 카페 로고 URL
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
};

type DeliveryBottomSheetProps = {
  deliveryItems: DeliveryItem[];
  loading: boolean;
};

function DeliveryCustomMap({ deliveryItems, loading }: DeliveryBottomSheetProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 35.1767, // 전남대학교의 위도
        longitude: 126.9085, // 전남대학교의 경도
        latitudeDelta: 0.01, // 지도의 확대 수준 설정 (작을수록 더 확대됨)
        longitudeDelta: 0.01, // 지도의 확대 수준 설정 (작을수록 더 확대됨)
      }}
    >
      {/* 마커 생성 */}
      {deliveryItems.map((item) => (
        <Marker
          key={item._id}
          coordinate={{
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lng),
          }}
          title={item.items.map((menu) => menu.menuName).join(", ")}
          description={`배달 유형: ${item.deliveryType} \n 배달비: ${item.deliveryFee}원`}
        />
      ))}
    </MapView>
  );
}

export default DeliveryCustomMap;
