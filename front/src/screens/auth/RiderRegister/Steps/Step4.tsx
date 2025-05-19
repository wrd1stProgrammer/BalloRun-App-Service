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
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { uploadFile } from '../../../../redux/actions/fileAction';

interface Step4ContentProps {
  images?: string | null;
}

const Step4Content: React.FC<Step4ContentProps> = ({ images }) => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (images) {
      console.log('ID 이미지 URI:', images);
    }
  }, [images]);

  const handleTakeFacePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'front',
      videoQuality: 'high',
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert('사진 촬영이 취소되었습니다.');
      } else if (response.errorMessage) {
        Alert.alert('사진 촬영 중 오류가 발생했습니다.', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setFaceImage(response.assets[0].uri || null);
      }
    });
  };

  const uploadAndNext = async () => {
    if (!faceImage) return;
    setUploading(true);
    try {
      navigate('Step5', { images, faceImage });
    } catch (err) {
      Alert.alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3384FF" />
          <Text style={styles.loadingText}>업로드 중...</Text>
        </View>
      )}

      <Text style={[authStyles.title, { textAlign: 'center' }]}>
        얼굴 인증
      </Text>

      {faceImage ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: faceImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setFaceImage(null)}
            disabled={uploading}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={authStyles.iconContainer}>
          <Ionicons name="person-circle" size={60} color="#999" />
        </View>
      )}

      <Text
        style={[
          authStyles.description,
          { textAlign: 'center', marginBottom: 20 },
        ]}
      >
        {faceImage
          ? '얼굴 사진이 준비되었습니다. 다시 찍으려면 버튼을 눌러주세요.'
          : '얼굴 정면 사진을 찍어주세요.'}
      </Text>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={handleTakeFacePhoto}
        disabled={uploading}
      >
        <Ionicons name="camera" size={24} color="#3384FF" />
        <Text style={styles.cardButtonText}>사진 찍기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!faceImage || uploading}
        style={[
          authStyles.wideEnableButton,
          {
            backgroundColor: faceImage ? '#3384FF' : '#CCC',
            marginTop: 30,
            opacity: faceImage ? 1 : 0.6,
          },
        ]}
        onPress={uploadAndNext}
      >
        <Text
          style={[
            authStyles.enableButtonText,
            { color: faceImage ? '#FFF' : '#888' },
          ]}
        >
          다음
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step4: React.FC<{ route: any }> = ({ route }) => {
  const images = route.params?.images;
  return (
    <View style={{ flex: 1 }}>
      <AuthHeader step={4} totalSteps={6} />
      <Step4Content images={images} />
    </View>
  );
};

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
    // Android elevation
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

export default Step4;
