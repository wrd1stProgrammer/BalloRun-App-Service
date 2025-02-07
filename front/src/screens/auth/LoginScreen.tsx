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
import { navigate } from '../../navigation/NavigationUtils';
import bgImage from "../../assets/images/bg.png";
import { useAppDispatch } from '../../redux/config/reduxHook';
import { userlogin } from '../../redux/actions/userAction';
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  unlink,
} from "@react-native-seoul/kakao-login";
import { kakaoLogin } from '../../redux/actions/userAction';
import { token_storage } from '../../redux/config/storage';
import { requestUserPermission } from '../../utils/fcm/fcmToken';
import { setUser } from '../../redux/reducers/userSlice';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
/**
 * [설명]
 * 1) "로그인" 버튼을 처음 누르면 아이디/비밀번호 입력 영역이 애니메이션으로 펼쳐지고,
 * 2) 입력 시 키보드가 올라와도 화면이 자동으로 위로 밀려서 입력 필드가 가려지지 않도록 처리.
 */
const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const [showLoginInputs, setShowLoginInputs] = useState(false);
  const [result, setResult] = useState<string>("");

  const checkKakaoUser = async (email:string) =>{
    await dispatch(kakaoLogin(email)); // res.data받음
  }

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      const profile = await getKakaoProfile();
      const email = profile.email;
      await checkKakaoUser(email);
      //setResult(JSON.stringify(token));
      //console.log('kakao token: ' , token); // a,r 토큰 가져오네
    } catch (err) {
      console.error("login err", err);
    }
  };

  // 높이 애니메이션용
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 입력받을 ID/PW
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // "로그인" 버튼 누를 때 호출
  const handlePressLogin = async() => {
    // 아직 입력란이 안보일 때 → 폼 펼치기
    if (!showLoginInputs) {
      setShowLoginInputs(true);
      Animated.timing(animatedHeight, {
        toValue: 130, // 0 -> 130
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      // 이미 펼쳐진 상태

      // navigate('BottomTab'); -> 홈 수정 때문에.
      await dispatch(userlogin(userId, password)); // 로그인 Action 
    }
  };

  const goRegister = () => {
    console.log('회원가입 누름');
    navigate('RegisterScreen');
  };

  // 로그인 버튼 텍스트: 입력란 펼쳐진 상태면 "로그인하기", 아니면 "로그인"
  const loginButtonText = showLoginInputs ? '로그인하기' : '로그인';

  return (
    /** 
     * KeyboardAvoidingView: iOS에서 behavior="padding" 또는 "position" 사용,
     * Android에선 보통 별도 처리 없으면 ScrollView + height 조절로 해결.
     */
    <KeyboardAvoidingView
      style={styles.keyboardAvoidContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* ScrollView를 감싸, 키보드가 올라왔을 때도 전체 스크롤 되도록 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 상단 배경 이미지 */}
        <Image 
          source={bgImage}
          style={styles.topIllustration}
          resizeMode="contain"
        />
        
        {/* 상단 안내 문구 */}
        <Text style={styles.headingTitle}>음료를 가져다 주는</Text>
        <Text style={styles.headingSubtitle}>편함을 주문해보세요</Text>

        {/* 하단 영역 */}
        <View style={styles.bottomContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            signInWithKakao();
          }}
        >
          <Text style={styles.text}>카카오 로그인</Text>
        </Pressable>


          {/* 로그인 버튼 (열기 or 실제 로그인) */}
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

          {/* 회원가입 버튼 */}
          <TouchableOpacity style={styles.signupButton} onPress={goRegister}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  /**
   * KeyboardAvoidingView가 전체 화면을 차지하도록
   */
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  topIllustration: {
    width: '80%',
    height: 200,
    marginBottom: 30,
  },
  headingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  headingSubtitle: {
    fontSize: 16,
    color: '#8A67F8',
    marginBottom: 40, 
  },
  bottomContainer: {
    width: '100%',
    marginTop: 50,
  },
  loginButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animatedInputContainer: {
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
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
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#FEE500",
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    textAlign: "center",
  },
});
