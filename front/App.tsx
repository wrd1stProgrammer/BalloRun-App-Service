import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/config/store";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/navigation/Navigation";
import WebSocketContainer from "./src/utils/Socket";
import './reanimatedConfig';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor="transparent"
      />
      <Provider store={store}>
        <WebSocketContainer>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
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
