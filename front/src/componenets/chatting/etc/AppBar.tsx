import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import { goBack, navigate } from "../../../navigation/NavigationUtils";

interface AppBarProps {
  title?: string;
}

const AppBar: React.FC<AppBarProps> = ({ title = "채팅방" }) => {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);

  const handleGoBack = () => {
    // Check if there is a stack to go back to
    if (navigationState.routes.length > 1) {
      goBack(); // Go back if there is a stack
    } else {
      // Navigate to the ChattingScreen within the bottom tab navigator
      navigate("BottomTab", { screen: "Chatting" });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Text style={styles.backButton}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#007AFF",
  },
  backButton: {
    fontSize: 20,
    color: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default AppBar;