import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';
import { selectOngoingOrder } from '../../redux/reducers/userSlice';
import { MapSocketContext } from '../../utils/sockets/MapSocket';
import { useAppSelector } from '../../redux/config/reduxHook';

// 위치 상태 타입 정의
interface Location {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Location | null;
  startTracking: () => void;
  stopTracking: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const watchIdRef = useRef<number | null>(null); // 내부적으로 watchId 관리
  const ongoingOrder = useAppSelector(selectOngoingOrder);
  const socket = useContext(MapSocketContext);

  // Android 위치 권한 요청
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return true; // iOS는 자동 권한 요청됨
    }
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('권한 요청 중 오류 발생:', error);
      return false;
    }
  };

  // 현재 위치 가져오기
  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error: GeoError) => {
        console.error('위치 가져오기 실패:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // 실시간 위치 추적 시작
  const startTracking = async (orderId) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    // 기존 watchId가 있으면 중지
    if (watchIdRef.current !== null) {
      console.log("🚨 기존 위치 추적 중지 (watchId 존재)", watchIdRef.current);
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // 새 watchPosition 시작
    const id = Geolocation.watchPosition(
      (position: GeoPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        console.log(`📍 위치 업데이트: ${latitude}, ${longitude}`);

     
          socket?.emit("update_location", { orderId, latitude, longitude });
          console.log(`🚀 배달 중인 주문 위치 업데이트: ${orderId}`);
     
      },
      (error: GeoError) => {
        Alert.alert("위치 추적 오류", error.message);
      },
      { enableHighAccuracy: true, interval: 5000, distanceFilter: 20 }
    );

    console.log("✅ 위치 추적 시작, watchId:", id);
    watchIdRef.current = id; // watchIdRef에 저장
  };

  // 실시간 위치 추적 중지
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      console.log("🚨 위치 추적 중지 시도 (watchId 존재)", watchIdRef.current);
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      socket?.emit("stop_tracking", {});
      console.log("✅ 위치 추적 중지 완료");
    }
  };

  useEffect(() => {
    getLocation();
    return () => stopTracking(); // 언마운트 시 추적 중지
  }, []);

  return (
    <LocationContext.Provider value={{ location, startTracking, stopTracking }}>
      {children}
    </LocationContext.Provider>
  );
};

// 위치 정보를 사용하는 커스텀 훅
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};