import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { goBack } from '../../../navigation/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { uploadFile } from '../../../redux/actions/fileAction';
import { editProfileAction, refetchUser } from '../../../redux/actions/userAction';

interface RouteParams {
  userImage: string | undefined;
  nickname: string;
  username: string;
}

const EditProfileScreen = () => {
  const user = useAppSelector(selectUser);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [username, setUsername] = useState(user?.username || '');
  const [images, setImages] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const dispatch = useAppDispatch();

  const handleSaveProfile = async () => {
    // 닉네임 유효성 검사
    if (!nickname) {
      setNicknameError('올바른 닉네임을 입력하세요');
      return;
    }

    if (nickname.length < 2 || nickname.length > 12) {
      setNicknameError('올바른 닉네임을 입력하세요 (2~12자)');
      return;
    }

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharRegex.test(nickname)) {
      setNicknameError('올바른 닉네임을 입력하세요 (특수문자 불가)');
      return;
    }

    if (/\s/.test(nickname)) {
      setNicknameError('올바른 닉네임을 입력하세요 (공백 불가)');
      return;
    }

    const numberOnlyRegex = /^[0-9]+$/;
    if (numberOnlyRegex.test(nickname)) {
      setNicknameError('올바른 닉네임을 입력하세요 (숫자만 불가)');
      return;
    }

    const consonantOnlyRegex = /^[ㄱ-ㅎ]+$/;
    if (consonantOnlyRegex.test(nickname)) {
      setNicknameError('올바른 닉네임을 입력하세요 (자음만 불가)');
      return;
    }

    setIsLoading(true); // 로딩 시작
    try {
      const userImage = images ? await dispatch(uploadFile(images, "newUserProfile_image")) : null;
      await dispatch(editProfileAction(username, nickname, userImage));
      await dispatch(refetchUser()); // user info update
      console.log('프로필 수정 완료:', { nickname, username });
      goBack();
    } catch (error) {
      Alert.alert('오류', '프로필 수정 중 문제가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    if (images) {
      console.log(images, 'images 정보');
    }
  }, [images]);

  const handleImagePress = async () => {
    if (images) {
      setImages(null);
    } else {
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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <TouchableOpacity 
          onPress={handleSaveProfile} 
          style={styles.headerButton} 
          disabled={isLoading} // 로딩 중에는 버튼 비활성화
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.saveButton}>완료</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePress}>
          {images ? (
            <Image source={{ uri: images }} style={styles.profileImage} />
          ) : user?.userImage ? (
            <Image source={{ uri: user?.userImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.smiley}>☺</Text>
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <Icon 
              name={images ? "close" : "camera"} 
              size={20} 
              color="#000" 
            />
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>닉네임</Text>
            {nicknameError && (
              <Text style={styles.errorText}>{nicknameError}</Text>
            )}
          </View>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setNicknameError(null);
            }}
            placeholder="2~12자, 특수문자/공백/자음만 불가"
            editable={!isLoading} // 로딩 중에는 입력 비활성화
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>사용자 이름</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            editable={!isLoading} // 로딩 중에는 입력 비활성화
          />
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  saveButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    fontSize: 40,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;