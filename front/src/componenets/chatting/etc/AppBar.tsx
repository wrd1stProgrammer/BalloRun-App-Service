import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { goBack,navigate } from "../../../navigation/NavigationUtils";
interface AppBarProps {
  title?: string;
}

const AppBar: React.FC<AppBarProps> = ({ title = "채팅방" }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => goBack()}>
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
