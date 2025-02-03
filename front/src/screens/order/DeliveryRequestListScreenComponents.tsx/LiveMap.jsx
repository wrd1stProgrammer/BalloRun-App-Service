import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../navigation/NavigationUtils";
import { MapSocketContext } from "../../../utils/MapSocket";
import { useRoute } from "@react-navigation/native"; // 추가

function LiveMap() {
    const socket = useContext(MapSocketContext);
    const route = useRoute();
    const { orderId } = route.params || {}; // 전달된 orderId 가져오기
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.on("receiveLocation", ({ latitude, longitude }) => {
            setDeliveryLocation({ latitude, longitude });
        });

        return () => {
            socket.off("receiveLocation");
        };
    }, [socket]);

    // '실시간 위치 확인' 버튼 클릭 시 서버에 위치 요청
    const requestLocationUpdate = () => {
        if (!orderId) {
            console.warn("⚠️ 주문 ID가 없습니다.");
            return;
        }
        
        setTracking(true);
        socket.emit("requestLocation", { orderId }); // 서버에 현재 주문의 위치 요청
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 35.1767,
                    longitude: 126.9085,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {deliveryLocation && (
                    <Marker coordinate={deliveryLocation} title="배달원 위치" />
                )}
            </MapView>

            <Button title="실시간 위치 확인" onPress={requestLocationUpdate} />
        </View>
    );
}

const styles = StyleSheet.create({
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
