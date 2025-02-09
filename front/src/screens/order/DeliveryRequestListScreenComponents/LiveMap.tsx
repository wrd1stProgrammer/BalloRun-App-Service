import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import { useRoute } from "@react-navigation/native";



const LiveMap = () => {

  const route = useRoute(); // 🔥 네비게이션에서 전달된 `orderId` 가져오기
  const { orderId } = route.params as { orderId: string }; // `orderId` 추출

  console.log(orderId)
  const socket = useContext(MapSocketContext);
  const [deliveryLocation, setDeliveryLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_order", { orderId })
    // 주문자의 위치 요청 (배달원의 최신 위치를 받기 위해)
    socket.emit("request_location", { orderId });

    // 배달원 위치 업데이트 이벤트 리스너 등록
    const handleLocationUpdate = (data: { orderId: string; latitude: number; longitude: number }) => {
      console.log("사용자가 배달자의 위치를 받음", data); // 🔥 전체 데이터 확인
    
      if (!data.orderId) {
        console.error("❌ orderId가 포함되지 않음", data);
        return;
      }

      if (data.orderId === orderId) {
        setDeliveryLocation({ latitude: data.latitude, longitude: data.longitude });
        console.log("백엔드에서 올바르게 위치 데이터를 받아옴", data);
        console.log(deliveryLocation)
      }
    };
    socket.on("update_location", handleLocationUpdate);
    // 정리 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("update_location", handleLocationUpdate);
    };
  }, [orderId, socket]);

  return (
    <View style={styles.container}>
<MapView
  style={styles.map}
  region={
    deliveryLocation
      ? {
          latitude: deliveryLocation.latitude,
          longitude: deliveryLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : {
          latitude: 37.7749, // 기본값
          longitude: -122.4194,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
  }
>
{deliveryLocation !== null && deliveryLocation !== undefined && (
  <Marker coordinate={deliveryLocation} title="배달원 위치" />
)}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LiveMap;