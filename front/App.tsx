import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/config/store";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/navigation/Navigation";
import WebSocketContainer from "./src/utils/sockets/Socket";
import "./reanimatedConfig";
import ChatSocketContainer from "./src/utils/sockets/ChatSocket";
import MapSocketContainer from "./src/utils/sockets/MapSocket";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { PERMISSIONS, request, check, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import { LocationProvider } from "./src/utils/Geolocation/LocationContext";
import { initializeAdMob } from "./src/screens/dash/AdMob/ConfigureAdMob";
import initializeNotifications from "./src/utils/fcm/notification";
// import KeyboardDismissWrapper from "./src/utils/KeyboardDismissWrapper";


const App: React.FC = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // ✅ 위치 권한 요청 함수
  const requestLocationPermission = async () => {
    let permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    // 현재 권한 상태 확인
    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      console.log("✅ 위치 권한이 이미 부여됨");
      setHasLocationPermission(true);
      return;
    }

    // 권한이 없으면 요청
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        console.log("✅ 위치 권한이 허용됨");
        setHasLocationPermission(true);
      } else {
        console.log("❌ 위치 권한이 거부됨");
        setHasLocationPermission(false);
        Alert.alert("위치 권한 필요", "앱을 사용하려면 위치 권한을 허용해야 합니다.");
      }
    }
  };

  // 앱 시작 
  useEffect(() => {
    requestLocationPermission();
    initializeAdMob();
    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
        <StatusBar translucent backgroundColor="transparent" />
        
          <Provider store={store}>
            <WebSocketContainer>
              <MapSocketContainer>
                <ChatSocketContainer>
                  <LocationProvider>
                  <PersistGate loading={null} persistor={persistor}>
                    <Navigation />
                  </PersistGate>
                  </LocationProvider>
                </ChatSocketContainer>
              </MapSocketContainer>
            </WebSocketContainer>
          </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;