import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/config/store";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/navigation/Navigation";
import WebSocketContainer from "./src/utils/sockets/Socket";
import './reanimatedConfig';
import ChatSocketContainer from "./src/utils/sockets/ChatSocket";
import MapSocketContainer from "./src/utils/sockets/MapSocket";
import { setupBackgroundNotifications, setupForegroundNotifications, onNotificationOpenedApp } from "./src/utils/fcm/FcmHandler";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStatusBarHeight } from "react-native-status-bar-height"; // 상태 바 높이 가져오기

const App: React.FC = () => {
  // useEffect(() => {
  //   const foregroundListener = setupForegroundNotifications();
  //   setupBackgroundNotifications();
  //   onNotificationOpenedApp();
  //   return () => {
  //     foregroundListener(); // 리스너 정리
  //   };
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SafeAreaView에서 상단만 보호 */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
        <StatusBar translucent backgroundColor="transparent" />
        
        {/* 기기별 상태 바 높이에 맞춰 자동 조정 */}
        <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? getStatusBarHeight(true) : 0 }}>
          <Provider store={store}>
            <WebSocketContainer>
              <MapSocketContainer>
                <ChatSocketContainer>
                  <PersistGate loading={null} persistor={persistor}>
                    <Navigation />
                  </PersistGate>
                </ChatSocketContainer>
              </MapSocketContainer>
            </WebSocketContainer>
          </Provider>
        </View>
        
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