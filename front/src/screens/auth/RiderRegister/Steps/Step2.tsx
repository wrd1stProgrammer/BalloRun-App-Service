import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { uploadFile } from '../../../../redux/actions/fileAction';

const Step2Content: React.FC = () => {
  const [images, setImages] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (images) {
      console.log(images, 'images 정보');
    }
  }, [images]);

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
        setImages(response.assets[0].uri || null);
      }
    });
  };

  const handleImagePicker = async () => {
    const option: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
    };

    const response = await launchImageLibrary(option);

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      setImages(response.assets[0].uri || null);
    }
  };

  const handleRemoveImage = () => setImages(null);

  const uploadIDcard = async () => {
    if (!images) return;
    try {
      setUploading(true);
      //await dispatch(uploadFile(images, 'verification_image'));
      navigate('Step3', { images });
    } catch (err) {
      Alert.alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      {/* 업로드 중일 때 오버레이 */}
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="black" />
          <Text style={styles.loadingText}>업로드 중...</Text>
        </View>
      )}

      <Text style={[authStyles.title, { textAlign: 'center' }]}>
        주민등록증 업로드
      </Text>

      {images ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: images }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveImage}
            disabled={uploading}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={authStyles.iconContainer}>
          <Ionicons name="camera" size={60} color="#999" />
        </View>
      )}

      <Text
        style={[
          authStyles.description,
          { textAlign: 'center', marginBottom: 20 },
        ]}
      >
        {images
          ? '이미지가 선택되었습니다. 다른 이미지를 선택하려면 아래 버튼을 이용하세요.'
          : '문서 확인을 완료하기 위해 방법을 선택하세요.'}
      </Text>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={handleTakePhoto}
        disabled={uploading}
      >
        <Ionicons name="camera" size={24} color="#3384FF" />
        <Text style={styles.cardButtonText}>휴대폰으로 사진 찍기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={handleImagePicker}
        disabled={uploading}
      >
        <Ionicons name="image" size={24} color="#3384FF" />
        <Text style={styles.cardButtonText}>기존 사진에서 업로드</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!images || uploading}
        style={[
          authStyles.wideEnableButton,
          {
            backgroundColor: images ? '#3384FF' : '#CCC',
            marginTop: 30,
            opacity: images ? 1 : 0.6,
          },
        ]}
        onPress={uploadIDcard}
      >
        <Text
          style={[
            authStyles.enableButtonText,
            { color: images ? '#FFF' : '#888' },
          ]}
        >
          다음
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step2: React.FC = () => (
  <View style={{ flex: 1 }}>
    <AuthHeader step={2} totalSteps={6} />
    <Step2Content />
  </View>
);

const styles = StyleSheet.create({
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: '5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  cardButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loadingText: {
    marginTop: 12,
    color: '#3384FF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Step2;
