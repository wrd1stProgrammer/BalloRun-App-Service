import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { goBack } from '../../../navigation/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 라이브러리 사용
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';
// 라우트 파라미터 타입 정의
interface RouteParams {
  userImage: string | undefined;
  nickname: string;
  username: string;
}

const EditProfileScreen = () => {
  const user = useAppSelector(selectUser);

  // 상태 관리
  const [nickname, setNickname] = useState(user?.nickname);
  const [username, setUsername] = useState(user?.username);

  // 프로필 수정 완료 함수 (사용자가 작성할 부분)
  const handleSaveProfile = () => {
    console.log('프로필 수정 완료:', { nickname, username });
    goBack();
  };

  // 프로필 이미지 터치 더미 로직
  const handleImagePress = () => {

  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <TouchableOpacity onPress={handleSaveProfile} style={styles.headerButton}>
          <Text style={styles.saveButton}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        {/* 프로필 사진 */}
        <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePress}>
          {user?.userImage ? (
            <Image source={{ uri: user?.userImage}} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.smiley}>☺</Text>
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <Icon name="camera" size={20} color="#000" />
          </View>
        </TouchableOpacity>

        {/* 닉네임 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={user?.nickname}
            onChangeText={setNickname}
            placeholder="아직 계정 내 닉네임 필드 없어서"
          />
        </View>

        {/* username 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>사용자 이름</Text>
          <TextInput
            style={styles.input}
            value={user?.username}
            onChangeText={setUsername}
            placeholder="username"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight, // iOS와 Android의 상태바 높이 고려
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
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default EditProfileScreen;