import Geolocation from "react-native-geolocation-service";
import { Alert } from "react-native";
import { requestLocationPermission } from "../permissions/location";

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error("위치 정보를 가져오는 중 오류 발생:", error);
        Alert.alert("위치 오류", "현재 위치를 가져올 수 없습니다.");
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};