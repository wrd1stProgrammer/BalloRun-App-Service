import React, { useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ChatSocketContext } from "../../utils/ChatSocket";

interface InputProps {
  chatRoomId: string;
  onPostMessageHandler: (message: string) => void;
}

const Input: React.FC<InputProps> = ({ chatRoomId, onPostMessageHandler }) => {
  const [message, setMessage] = useState("");
  const socket = useContext(ChatSocketContext);

  // 메시지 전송 함수 (WebSocket 활용)
  const handleSend = () => {
    if (message.trim().length > 0 && socket) {


      onPostMessageHandler(message); 

      socket.emit("sendMessage", {
        chatRoomId,
        message,
      });

      setMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요..."
        value={message}
        onChangeText={setMessage}
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
    backgroundColor: "#F5F5F5",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Input;
