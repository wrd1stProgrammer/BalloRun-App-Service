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
import Geolocation from "react-native-geolocation-service";
import { LocationProvider } from "./src/utils/Geolocation/LocationContext";
import { initializeAdMob } from "./src/screens/dash/AdMob/ConfigureAdMob";
import initializeNotifications from "./src/utils/fcm/notification";
import { requestLocationPermission } from "./src/utils/permissions/location";
// import KeyboardDismissWrapper from "./src/utils/KeyboardDismissWrapper";


const App: React.FC = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestLocationPermission();
      setHasLocationPermission(granted);
    };
    getPermission();

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