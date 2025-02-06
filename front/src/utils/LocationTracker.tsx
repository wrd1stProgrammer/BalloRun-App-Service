import React, { useEffect, useState, useContext } from "react";
import { MapSocketContext } from "./sockets/MapSocket";
import * as Location from "expo-location";

function LocationTracker() {
    const socket = useContext(MapSocketContext);
    const [location, setLocation] = useState<any>("");

    useEffect(() => {
        const startTracking = async () => {
            let { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;

            setInterval(async () => {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location.coords);

                if (socket) {
                    socket.emit("updateLocation", {
                        userId: "delivery123", // 배달원 ID (실제 ID 사용)
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });

                    console.log(`📍 위치 전송: ${location.coords.latitude}, ${location.coords.longitude}`);
                }
            }, 5000); // 5초마다 위치 업데이트
        };

        startTracking();
    }, [socket]);

    return null; // UI 없이 백그라운드에서 실행
}

export default LocationTracker;
