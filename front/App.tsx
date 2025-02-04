import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
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
import { setupBackgroundNotifications,setupForegroundNotifications,onNotificationOpenedApp } from "./src/utils/fcm/FcmHandler";
import { startFcm } from "./src/utils/fcm/fcmInitailizeApp";

const App: React.FC = () => {
  //fcm client 포/백 그라운드 설정.
  useEffect(() => {

    // startFcm();

    const foregroundListener = setupForegroundNotifications();
    setupBackgroundNotifications();
    onNotificationOpenedApp();
    return () => {
      foregroundListener(); // 언마운트 -> 리스너 정리 음 아마
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor="transparent"
      />
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
