import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface InputProps {
  onPostMessageHandler: (message: string) => void;
}

const Input: React.FC<InputProps> = ({ onPostMessageHandler }) => {
  const [message, setMessage] = useState("");
  
  //api 작성
  const handleSend = () => {
    if (message.trim().length > 0) {
      onPostMessageHandler(message);
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
      <Button title="전송" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#F5F5F5",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginRight: 8,
  },
});

export default Input;
