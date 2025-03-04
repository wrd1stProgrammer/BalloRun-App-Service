import React, { useState, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { ChatSocketContext } from '../../utils/sockets/ChatSocket';
import { uploadFile } from '../../redux/actions/fileAction';
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { Ionicons } from '@expo/vector-icons';
import { updateLastChat } from '../../redux/reducers/chatSlice';

interface InputProps {
  chatRoomId: string;
  onPostMessageHandler: (message: string, imageUrl?: string, isLoading?: boolean, tempId?: string) => void;
}

const Input: React.FC<InputProps> = ({ chatRoomId, onPostMessageHandler }) => {
  const [message, setMessage] = useState('');
  const socket = useContext(ChatSocketContext);
  const [selectedImage, setSelectedImage] = useState<{ uri: string; type: string; fileName?: string } | null>(null);
  const dispatch = useAppDispatch();

  const handleTakePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      videoQuality: 'high',
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert('사진 촬영이 취소되었습니다.');
      } else if (response.errorMessage) {
        Alert.alert('사진 촬영 중 오류가 발생했습니다.', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const { uri, type, fileName } = response.assets[0];
        setSelectedImage({ uri: uri!, type: type!, fileName });
      }
    });
  };

  const showPhoto = async () => {
    const option: ImageLibraryOptions = {
      mediaType: 'photo',
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

  const handleSubmit = async () => {
    if (!selectedImage?.uri) {
      Alert.alert('사진을 선택해주세요.');
      return;
    }

    const tempId = `temp_${Date.now()}`;
    onPostMessageHandler('', selectedImage.uri, true, tempId);

    try {
      const imageResponse = await dispatch(uploadFile(selectedImage.uri, 'chat_image'));
      if (imageResponse) {
        const imageUrl = imageResponse;
        socket?.emit('sendImageMessage', {
          chatRoomId,
          imageUrl,
        });
        onPostMessageHandler('', imageUrl, false, tempId);
        // 리덕스 업데이트
        dispatch(
          updateLastChat({
            roomId: chatRoomId,
            lastChat: '사진을 보냈습니다.',
            lastChatAt: new Date().toISOString(),
          })
        );
        
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert('업로드 실패', '사진 업로드 중 오류가 발생했습니다.');
      onPostMessageHandler('', selectedImage.uri, false, tempId);
    }
  };

  const handleSend = () => {
    if (message.trim().length > 0 && socket) {
      onPostMessageHandler(message);
      socket.emit('sendMessage', {
        chatRoomId,
        message,
      });
      // 리덕스 업데이트
      dispatch(
        updateLastChat({
          roomId: chatRoomId,
          lastChat: message,
          lastChatAt: new Date().toISOString(),
        })
      );

      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={showPhoto} style={styles.imageButton}>
          <Ionicons name="image-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity onPress={handleTakePhoto} style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={selectedImage ? handleSubmit : handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageButton: {
    marginRight: 8,
  },
  cameraButton: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 1,
  },
});

export default Input;