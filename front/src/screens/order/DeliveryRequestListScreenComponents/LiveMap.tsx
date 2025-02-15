import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapSocketContext } from "../../../utils/sockets/MapSocket";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";

const LiveMap = () => {
  const route = useRoute(); 
  const { orderId, status } = route.params as { orderId: string, status: string }; 
  const socket = useContext(MapSocketContext);
  const [deliveryLocation, setDeliveryLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // 🔥 상태에 따른 마커 색상 설정 함수
  const getMarkerColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "blue"; // 배달 수락됨
      case "delivered":
        return "green"; // 배달 완료됨
      case "goToCafe":
        return "orange"; // 카페로 이동 중
      case "goToClient":
        return "purple"; // 고객에게 이동 중
      case "makingMenu":
        return "yellow"; // 제품 픽업 완료
      case "complete":
        return "black"; // 배달 완료
      case "cancelled":
        return "red"; // 배달 취소
      default:
        return "gray"; // 기본값
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_order", { orderId })
    socket.emit("request_location", { orderId });

    const handleLocationUpdate = (data: { orderId: string; latitude: number; longitude: number }) => {
      console.log("사용자가 배달자의 위치를 받음", data); 
    
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
    return () => {
      socket.off("update_location", handleLocationUpdate);
    };
  }, [orderId, socket]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
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
          <Marker 
            coordinate={deliveryLocation} 
            title="배달원 위치"
            pinColor={getMarkerColor(status)} 
          />
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
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default LiveMap;