import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Color from "../../../constants/Colors";
import TYPOS from "./TYPOS";

interface DialogProps {
  isOpened: boolean;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> & {
  Content: React.FC<{ content: string }>;
  Buttons: React.FC<{ buttons: { label: string; onPressHandler: () => void }[] }>;
} = ({ isOpened, children }) => {
  return (
    <Modal transparent visible={isOpened} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>{children}</View>
      </View>
    </Modal>
  );
};

// Dialog Content
Dialog.Content = ({ content }) => {
  return <Text style={[TYPOS.body1, styles.content]}>{content}</Text>;
};

// Dialog Buttons
Dialog.Buttons = ({ buttons }) => {
  return (
    <View style={styles.buttonContainer}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={button.onPressHandler}>
          <Text style={styles.buttonText}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    width: 300,
    backgroundColor: Color.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  content: {
    marginBottom: 20,
    color: Color.black,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: Color.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Color.white,
    fontWeight: "bold",
  },
});

export default Dialog;
