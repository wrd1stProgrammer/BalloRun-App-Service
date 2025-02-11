import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text as RNText } from 'react-native';
import { Text, TextInput, Button, Checkbox, useTheme, IconButton } from 'react-native-paper';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { register, verifyEmail } from '../../redux/actions/userAction';
import { useNavigation } from '@react-navigation/native';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';


const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerifyReady, setIsEmailVerifyReady] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setName] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // 5분 타이머 (초 단위)
  const [serverVerificationCode, setServerVerificationCode] = useState(''); // 서버에서 받은 인증 코드 저장

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedCode = await AsyncStorage.getItem('verificationCode');
        const storedTimer = await AsyncStorage.getItem('verificationTimer');
        if (storedCode) setServerVerificationCode(storedCode);
        if (storedTimer) setTimer(parseInt(storedTimer, 10));
      } catch (error) {
        console.error('Failed to load stored data:', error);
      }
    };
    loadStoredData();
  }, []);


  // 타이머 효과
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          AsyncStorage.setItem('verificationTimer', newTime.toString());
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      AsyncStorage.removeItem('verificationCode');
      AsyncStorage.removeItem('verificationTimer');
    }
  }, [timer]);

  const handleEmailVerification = async () => {
    if (!email) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await dispatch(verifyEmail(email));
      if (response.message === "이미 존재하는 이메일입니다.") {
        Alert.alert('오류', '이미 존재하는 이메일입니다.');
        return;
      }
      setServerVerificationCode(response.verificationCode);
      setTimer(300);
      await AsyncStorage.setItem('verificationCode', response.verificationCode);
      await AsyncStorage.setItem('verificationTimer', '300');
      Alert.alert('인증 코드 발송', '이메일로 인증 코드가 발송되었습니다. 5분 내에 입력해주세요.');
    } catch (error) {
      Alert.alert('오류', '이메일 인증 코드 발송에 실패했습니다.');
    }
  };

  const handleVerificationCodeCheck = () => {
    if (verificationCode.trim() === '') {
      Alert.alert('오류', '인증 코드를 입력해주세요.');
      return;
    }
    if (verificationCode === serverVerificationCode) {
      setIsEmailVerifyReady(true);
      setTimer(0);
      Alert.alert('성공', '이메일 인증이 완료되었습니다.');
    } else {
      Alert.alert('오류', '인증 코드가 일치하지 않습니다.');
    }
  };

  // 비밀번호 확인
  const handlePasswordConfirmation = () => {
    if (password.trim() === '') {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }

    Alert.alert('확인 필요', '비밀번호 확인란에 동일한 비밀번호를 입력해주세요.');
    setIsPasswordConfirmed(true);
  };

  // 회원가입 처리
  const handleRegister = async () => {
    if (!isEmailVerifyReady) {
      Alert.alert('이메일 인증', '이메일 인증을 완료해주세요.');
      return;
    }

    if (!isTermsChecked) {
      Alert.alert('약관 동의', '회원가입을 진행하려면 약관에 동의해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      await dispatch(register(email, userId, password, username));
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다!');
      resetAndNavigate('LoginScreen');
    } catch (error) {
      Alert.alert('오류', '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>회원가입</Text>

      {/* 이메일 입력 */}
      <TextInput
        label="이메일"
        mode="flat"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholder="email@example.com"
      />
      <Button mode="contained" onPress={handleEmailVerification} style={styles.button} disabled={timer > 0}>
        {timer > 0 ? `재전송 가능 (${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60})` : '이메일 인증 요청'}
      </Button>

      {/* 인증 코드 입력 */}
      <TextInput
        label="인증 코드"
        mode="flat"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
        style={styles.input}
        placeholder="이메일로 받은 인증 코드를 입력해주세요"
      />
      <Button mode="contained" onPress={handleVerificationCodeCheck} style={styles.button} disabled={timer === 0}>
        인증 코드 확인
      </Button>

      {/* 아이디 입력 */}
      <TextInput
        label="아이디"
        mode="flat"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
        style={styles.input}
      />

      {/* 비밀번호 입력 */}
      <View style={styles.passwordContainer}>
        <TextInput
          label="비밀번호"
          mode="flat"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { flex: 1 }]}
          placeholder="비밀번호를 입력해주세요"
        />
        <IconButton
          icon="check"
          size={24}
          onPress={handlePasswordConfirmation}
          style={styles.checkButton}
        />
      </View>

      {/* 비밀번호 확인 입력 */}
      {isPasswordConfirmed && (
        <TextInput
          label="비밀번호 확인"
          mode="flat"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          placeholder="비밀번호를 다시 입력해주세요"
        />
      )}

      {/* 이름 입력 */}
      <TextInput
        label="닉네임"
        mode="flat"
        value={username}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
        placeholder="닉네임을 입력해주세요"
      />

      {/* 약관 동의 */}
      <View style={styles.checkboxContainer}>
        <Checkbox.Android
          status={isTermsChecked ? 'checked' : 'unchecked'}
          onPress={() => setIsTermsChecked(!isTermsChecked)}
        />
        <RNText style={styles.checkboxLabel}>
          <Text>약관에 동의합니다</Text>
        </RNText>
      </View>

      {/* 약관 보기 */}
      <TouchableOpacity
        style={styles.termsButton}
        onPress={() => Alert.alert('약관', '임시 약관 내용입니다. 동의 후 진행해주세요.')}
      >
        <Text style={styles.termsText}>약관 내용 보기</Text>
      </TouchableOpacity>

      {/* 회원가입 버튼 */}
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={!isTermsChecked || !isEmailVerifyReady || loading}
        style={[styles.button, (!isTermsChecked || !isEmailVerifyReady) && styles.disabledButton]}
      >
        동의하고 회원가입
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkButton: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  termsButton: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#6200ea',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6200ea',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
});

export default RegisterScreen;