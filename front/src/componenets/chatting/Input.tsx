import React, { useState, useContext } from "react";
import { View, Alert, TextInput, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { ChatSocketContext } from "../../utils/sockets/ChatSocket";
import { uploadFile } from "../../redux/actions/fileAction";
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { useAppDispatch } from "../../redux/config/reduxHook";
import { Ionicons } from '@expo/vector-icons'; // Ionicons로 변경

interface InputProps {
  chatRoomId: string;
  onPostMessageHandler: (message: string,imageUrl?:string,isLoading?:boolean,tempId?:string) => void;
}

const Input: React.FC<InputProps> = ({ chatRoomId, onPostMessageHandler }) => {
  const [message, setMessage] = useState("");
  const socket = useContext(ChatSocketContext);
  const [selectedImage, setSelectedImage] = useState<{ 
    uri: string; 
    type: string;
    fileName?: string;
  } | null>(null);
  const dispatch = useAppDispatch();

  // 사진 촬영
  const handleTakePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      videoQuality: "high",
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert("사진 촬영이 취소되었습니다.");
      } else if (response.errorMessage) {
        Alert.alert("사진 촬영 중 오류가 발생했습니다.", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const { uri, type, fileName } = response.assets[0];
        setSelectedImage({ uri: uri!, type: type!, fileName });
      }
    });
  };

  // 갤러리에서 사진 선택
  const showPhoto = async () => {
    const option: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: true,
    };

    const response: ImagePickerResponse = await launchImageLibrary(option);

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      const { uri, type, fileName } = response.assets[0];
      setSelectedImage({ uri: uri!, type: type!, fileName });
    }
  };

  // 이미지 업로드 및 메시지 전송
  const handleSubmit = async () => {
    if (!selectedImage?.uri) {
      Alert.alert("사진을 선택해주세요.");
      return;
    }
  
    // 임시 ID 생성
    const tempId = `temp_${Date.now()}`;
  
    // 임시 이미지와 로딩 상태 전달
    onPostMessageHandler("", selectedImage.uri, true, tempId);
  
    try {
      const imageResponse = await dispatch(uploadFile(selectedImage.uri, "chat_image"));
      if (imageResponse) {
        const imageUrl = imageResponse; // 업로드된 이미지 URL
        socket?.emit("sendImageMessage", {
          chatRoomId,
          imageUrl,
        });
        onPostMessageHandler("", imageUrl, false, tempId); // 로딩 종료 및 실제 URL 전달
        setSelectedImage(null); // 선택된 이미지 초기화
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      Alert.alert("업로드 실패", "사진 업로드 중 오류가 발생했습니다.");
      onPostMessageHandler("", selectedImage.uri, false, tempId); // 로딩 종료
    }
  };
  // 텍스트 메시지 전송
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
      {/* 이미지 선택 및 촬영 버튼 */}
      <View style={styles.imageButtons}>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.imageButton}>
          <Text>
          <Ionicons name="camera" size={24} color="#3797EF" /> {/* Ionicons로 변경 */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showPhoto} style={styles.imageButton}>
          <Text>
          <Ionicons name="image" size={24} color="#3797EF" /> {/* Ionicons로 변경 */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 선택된 이미지 미리보기 */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
            <Text>
            <Ionicons name="close" size={20} color="#fff" /> {/* Ionicons로 변경 */}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 메시지 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* 전송 버튼 */}
      <TouchableOpacity style={styles.sendButton} onPress={selectedImage ? handleSubmit : handleSend}>
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
  imageButtons: {
    flexDirection: "row",
    marginRight: 10,
  },
  imageButton: {
    marginHorizontal: 5,
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
  imagePreviewContainer: {
    position: "relative",
    marginRight: 10,
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    padding: 1,
  },
});

export default Input;