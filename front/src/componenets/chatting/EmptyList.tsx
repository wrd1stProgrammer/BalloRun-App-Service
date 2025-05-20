import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Color from "../../constants/Colors";
import TYPOS from "./etc/TYPOS";

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text style={[TYPOS.body1, styles.text]}>채팅방이 없습니다.</Text>
      <Text style={[TYPOS.body2, styles.text]}>
        새로운 채팅방을 생성해보세요!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#F9F9F9"
  },
  text: {
    color: Color.neutral2,
    textAlign: "center",
  },
});

export default EmptyList;
