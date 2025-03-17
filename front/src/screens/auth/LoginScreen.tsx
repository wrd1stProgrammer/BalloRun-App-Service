import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { navigate, resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { userlogin, kakaoLogin } from '../../redux/actions/userAction';
import { login as kakaoLoginFn, getProfile as getKakaoProfile } from '@react-native-seoul/kakao-login';
//import { AppleAuthentication } from '@invertase/react-native-apple-authentication'; // 애플 로그인
import { token_storage } from '../../redux/config/storage';
import { requestUserPermission } from '../../utils/fcm/fcmToken';
import { setUser } from '../../redux/reducers/userSlice';
import { BASE_URL } from '../../redux/config/API';

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLoginInputs, setShowLoginInputs] = useState(false);
  const [result, setResult] = useState<string>('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 높이 애니메이션
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 카카오 로그인
  const checkKakaoUser = async (email: string) => {
    await dispatch(kakaoLogin(email));
  };

  const signInWithKakao = async (): Promise<void> => {
    try {
      console.log(BASE_URL, 'baseurl');
      const token = await kakaoLoginFn();
      const profile = await getKakaoProfile();
      const email = profile.email;
      await checkKakaoUser(email);
    } catch (err) {
      console.error('kakao login err', err);
    }
  };

  // 애플 로그인
  /*
  const signInWithApple = async (): Promise<void> => {
    try {
      const response = await AppleAuthentication.signIn({
        requestedScopes: [AppleAuthentication.Scope.EMAIL, AppleAuthentication.Scope.FULL_NAME],
      });
      const email = response.email || 'apple-user@unknown.com';
      await dispatch(kakaoLogin(email)); // 동일한 액션 재사용 (필요 시 별도 액션 생성)
    } catch (err) {
      console.error('apple login err', err);
    }
  };
*/
  // 사용자 로그인 버튼 핸들러
  const handlePressLogin = async () => {
    if (!showLoginInputs) {
      setShowLoginInputs(true);
      Animated.timing(animatedHeight, {
        toValue: 130,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      await dispatch(userlogin(userId, password));
    }
  };

  const goRegister = () => {
    console.log('회원가입 누름');
    navigate('FirstScreen');
  };

  const loginButtonText = showLoginInputs ? '로그인' : '사용자 로그인';

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>



        {/* 하단 영역 */}
        <View style={styles.bottomContainer}>
          {/* Sign Up 텍스트 */}
          <Text style={styles.signUpText}>Sign Up</Text>

          {/* 카카오 로그인 버튼 */}
          <Pressable style={styles.kakaoButton} onPress={signInWithKakao}>
            <Text style={styles.buttonText}>카카오톡 로그인</Text>
          </Pressable>

          {/* {Platform.OS === 'ios' && AppleAuthentication.isSupported && (*/}
            <Pressable style={styles.appleButton}>
              <Text style={styles.buttonText}>애플 로그인</Text>
            </Pressable>
          

          {/* 사용자 로그인 버튼 (파란색 버튼) */}
          <TouchableOpacity style={styles.loginButton} onPress={handlePressLogin}>
            <Text style={styles.loginButtonText}>{loginButtonText}</Text>
          </TouchableOpacity>

          {/* 펼쳐지는 Animated 영역 (ID/PW) */}
          <Animated.View
            style={[styles.animatedInputContainer, { height: animatedHeight }]}
          >
            {showLoginInputs && (
              <View style={styles.innerInputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="아이디"
                  value={userId}
                  onChangeText={setUserId}
                />
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            )}
          </Animated.View>

          {/* 회원가입 버튼 (Sign As Guest 스타일) */}
          <TouchableOpacity style={styles.guestButton} onPress={goRegister}>
            <Text style={styles.guestButtonText}>회원 가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1, // 전체 테두리 추가
    borderColor: '#ddd', // 연한 회색 테두리
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  topIllustration: {
    width: '60%',
    height: 150,
    marginBottom: 20,
  },
  headingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
  },
  signUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 25,
    width: '80%',
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 버튼 테두리 추가
    borderColor: '#ddd',
  },
  appleButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    width: '80%',
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 버튼 테두리 추가
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#5A6EF7',
    borderRadius: 25,
    width: '80%',
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 버튼 테두리 추가
    borderColor: '#ddd',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  animatedInputContainer: {
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '80%',
    marginBottom: 15,
    borderWidth: 1, // 입력 영역 테두리 추가
    borderColor: '#ddd',
  },
  innerInputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    marginBottom: 10,
    fontSize: 16,
  },
  guestButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    width: '80%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});