import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";

type LiveMapProps = {
  orderId: string;
};

const LiveMap = ({ orderId }: LiveMapProps) => {
  const socket = useContext(MapSocketContext);
  const [deliveryLocation, setDeliveryLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!socket) return;

    // 주문자의 위치 요청 (배달원의 최신 위치를 받기 위해)
    socket.emit("request_location", { orderId });

    // 배달원 위치 업데이트 이벤트 리스너 등록
    const handleLocationUpdate = (data: { orderId: string; latitude: number; longitude: number }) => {
      if (data.orderId === orderId) {
        setDeliveryLocation({ latitude: data.latitude, longitude: data.longitude });
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
        {deliveryLocation && (
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