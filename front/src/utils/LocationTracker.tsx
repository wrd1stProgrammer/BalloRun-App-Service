import { useEffect, useState } from "react";
import io from "socket.io-client";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";
import { IPV4, PORT } from "@env";

// 웹소켓 서버 주소 (실제 서버 주소로 변경 필요)
const socket = io(`http://${IPV4}:${PORT}/location`);

interface LocationData {
    userId: string;
    latitude: number;
    longitude: number;
}

//  위치 추적 및 웹소켓 로직을 포함하는 커스텀 훅
export function useLocationTracker(userId: string) {
    const [userLocations, setUserLocations] = useState<{ [key: string]: LocationData }>({});
    console.log(userLocations)
    useEffect(() => {
        //  위치 권한 요청 (Android)
        const requestLocationPermission = async () => {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Location permission denied");
                    return;
                }
            }
            startTracking();
        };

        //  위치 지속적 업데이트 및 서버로 전송
        const startTracking = () => {
            Geolocation.watchPosition(
                (position) => {
                    const newLocation: LocationData = {
                        userId,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    // 서버로 위치 전송
                    socket.emit("updateLocation", newLocation);

                    // 클라이언트에서 위치 저장 (다른 사용자들 위치 표시)
                    setUserLocations((prev) => ({ ...prev, [userId]: newLocation }));
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000, } // 5m 이동 시 업데이트
            );
        };

        requestLocationPermission();

        return () => {
            Geolocation.stopObserving();
            socket.off("locationUpdate");
        };
    }, [userId]);

    useEffect(() => {
        //  서버에서 받은 위치 데이터 저장
        socket.on("locationUpdate", (data: LocationData) => {
            setUserLocations((prev) => ({ ...prev, [data.userId]: data }));
        });

        return () => socket.off("locationUpdate");
    }, []);

    return { userLocations };
}
