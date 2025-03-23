import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';

const Step2Content: React.FC = () => {
  const [images, setImages] = useState<string | null>(null); // uri만 저장

  useEffect(() => {
    if (images) {
      console.log(images, 'images 정보');
    }
  }, [images]);

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
        const uri = response.assets[0].uri;
        setImages(uri || null);
      }
    });
  };

  const handleImagePicker = async () => {
    const option: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: true,
    };

    const response: ImagePickerResponse = await launchImageLibrary(option);

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setImages(uri || null);
    }
  };

  const handleRemoveImage = () => {
    setImages(null); // 이미지 상태를 null로 설정하여 제거
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={[authStyles.title, { textAlign: 'center' }]}>주민등록증 업로드</Text>

      {/* 이미지 미리보기 */}
      {images ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: images }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveImage}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={authStyles.iconContainer}>
          <Ionicons name="camera" size={50} color="#666" />
        </View>
      )}

      <Text style={[authStyles.description, { textAlign: 'center', marginBottom: 20 }]}>
        {images ? '이미지가 선택되었습니다. 다른 이미지를 선택하려면 위 버튼을 사용하세요 ' : '문서 확인을 완료하기 위해 방법을 선택하세요'}
      </Text>

      <TouchableOpacity
        style={[styles.optionButton, { marginBottom: 10 }]}
        onPress={handleTakePhoto}
      >
        <Ionicons name="camera" size={20} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.optionButtonText}>휴대폰으로 사진 찍기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={handleImagePicker}
      >
        <Ionicons name="image" size={20} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.optionButtonText}>기존 사진 업로드</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[authStyles.wideEnableButton, { backgroundColor: '#0064FF', marginTop: 30 }]}
        onPress={() => navigate('Step3',{images})}
      >
        <Text style={authStyles.enableButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step2: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <AuthHeader step={2} totalSteps={6} />
      <Step2Content />
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor:'#0064FF',
    borderColor: '#FFD700',
    width: '90%',
    marginHorizontal: '5%',
  },
  optionButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textAlign: 'left',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200, // 미리보기 이미지 크기 조정
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Step2;