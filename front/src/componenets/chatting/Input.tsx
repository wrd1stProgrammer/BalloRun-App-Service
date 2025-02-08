import React, { useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { ChatSocketContext } from "../../utils/sockets/ChatSocket";

interface InputProps {
  chatRoomId: string;
  onPostMessageHandler: (message: string) => void;
}

const Input: React.FC<InputProps> = ({ chatRoomId, onPostMessageHandler }) => {
  const [message, setMessage] = useState("");
  const socket = useContext(ChatSocketContext);

  const handleSend = () => {
    if (message.trim().length > 0 && socket) {
      onPostMessageHandler(message);
      socket.emit("sendMessage", {
        chatRoomId,
        message,
      });
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>전송</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3797EF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Input;