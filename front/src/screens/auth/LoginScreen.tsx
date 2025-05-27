import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { userlogin, kakaoLogin } from '../../redux/actions/userAction';
import { login as kakaoLoginFn, getProfile as getKakaoProfile } from '@react-native-seoul/kakao-login';
import { navigate } from '../../navigation/NavigationUtils';
import AppleLoginButton from './AppleLoginButton';
import { screenHeight,screenWidth } from '../../utils/Scaling';

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const screenH = screenHeight;
  const scrennW = screenWidth;

  /* kakao */
  const onKakao = async () => {
    try {
      const _ = await kakaoLoginFn();
      const profile = await getKakaoProfile();
      await dispatch(kakaoLogin(profile.email));
    } catch (e) { console.error(e); }
  };

  /* native */
  const onNative = async () => {
    if (!userId || !password) return;
    await dispatch(userlogin(userId, password));
  };

  const onRegister = () => navigate('FirstScreen');

  const loginDisabled = !(userId && password);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* logo */}
        <Image source={require('../../assets/Icon/appstore.png')} style={styles.logo}/>
        <Text style={styles.slogan}>발로뛰어와 함께 심부름을 시작하세요!</Text>

        {/* ID & PW */}
        <View style={styles.inputWrap}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            placeholder="예) ballorunrun@gmail.com"
            placeholderTextColor="#C5C6CC"
            autoCapitalize="none"
            value={userId}
            onChangeText={setUserId}
          />
        </View>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#C5C6CC"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* native login */}
        <TouchableOpacity
          style={[styles.loginBtn, loginDisabled && styles.loginDisabled]}
          disabled={loginDisabled}
          onPress={onNative}
        >
          <Text style={styles.loginTxt}>로그인</Text>
        </TouchableOpacity>

        {/* kakao */}
        <Pressable style={styles.kakaoBtn} onPress={onKakao} android_ripple={{color:'rgba(0,0,0,0.05)'}}>
          <Image source={require('../../assets/Icon/kakaologin2.png')} style={styles.kakaoImg}/>
        </Pressable>

        {/* links */}
        <View style={styles.linkRow}>
          <TouchableOpacity onPress={onRegister}><Text style={styles.linkTxt}>회원가입</Text></TouchableOpacity>
          <View style={styles.pipe}/>
          <TouchableOpacity onPress={()=> {navigate("FindIdScreen")}}><Text style={styles.linkTxt}>아이디 찾기</Text></TouchableOpacity>
          <View style={styles.pipe}/>
          <TouchableOpacity onPress={()=> {navigate("FindPasswordScreen")}}><Text style={styles.linkTxt}>비밀번호 찾기</Text></TouchableOpacity>
        </View>

        {/* apple */}
        <AppleLoginButton style={styles.appleWrap}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flexGrow: 1, alignItems: 'center', paddingTop: 100, paddingHorizontal: 24, paddingBottom: 140 },
  logo: { width:screenWidth*0.2, height: screenHeight*0.2, resizeMode: 'contain', marginBottom: 6 },
  slogan: { fontSize: 11, letterSpacing: 1, fontWeight: '600', color: '#6A6B71', marginBottom: 32 },

  inputWrap: { width: '100%', marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#222', marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#E5E6EC', paddingVertical: 8, fontSize: 15, color: '#000' },

  loginBtn: { width: '100%', height: 48, borderRadius: 6, backgroundColor: '#3A3A3C', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  loginDisabled: { backgroundColor: '#D1D1D6' },
  loginTxt: { color: '#fff', fontSize: 18, fontWeight: '600' },

  kakaoBtn: { width: '100%', height: 48, borderRadius: 6, overflow: 'hidden', marginBottom: 24 },
  kakaoImg: { width: '100%', height: '100%', resizeMode: 'cover' },

  linkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  linkTxt: { fontSize: 12, color: '#777' },
  pipe: { width: 1, height: 10, backgroundColor: '#E0E0E0', marginHorizontal: 10 },

  /* Apple 버튼을 화면 하단 고정 */
  appleWrap: { position: 'absolute', bottom: 24, left: 24, right: 24 },
});
