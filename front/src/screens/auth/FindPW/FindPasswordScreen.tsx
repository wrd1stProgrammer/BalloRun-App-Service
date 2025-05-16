import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack, navigate } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { verifyEmail } from '../../../redux/actions/userAction';

const FindPasswordScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState<0 | 1>(0);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(5 * 60); // 5분

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 1) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendCode = async () => {
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('이름과 이메일을 모두 입력해주세요');
      return;
    }
    try {
      const returnedCode = await dispatch(verifyEmail(email));
      setSentCode(returnedCode || '');
      setStep(1);
      setTimer(5 * 60);
    } catch {
      setError('인증번호 전송에 실패했습니다');
    }
  };

  const handleVerify = () => {
    if (timer === 0) {
      setError('인증 시간이 만료되었습니다. 다시 요청해주세요.');
    } else if (code === sentCode) {
      navigate('ResetPasswordScreen',{email});
    } else {
      setError('인증번호가 일치하지 않습니다');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>비밀번호 찾기</Text>
        </View>

        <View style={styles.inputContainer}>
          {step === 0 && (
            <View>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름"
                value={name}
                onChangeText={t => {
                  setName(t);
                  setError('');
                }}
                maxLength={10}
              />

              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="example@domain.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  setError('');
                }}
              />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.label}>인증번호 ({formatTime(timer)})</Text>
              <TextInput
                style={styles.input}
                placeholder="인증번호 6자리"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={t => {
                  setCode(t);
                  setError('');
                }}
                editable={timer > 0}
              />
            </View>
          )}

          {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            step === 1 && timer === 0 ? { backgroundColor: '#aaa' } : {},
          ]}
          onPress={step === 0 ? handleSendCode : handleVerify}
          disabled={step === 1 && timer === 0}
        >
          <Text style={styles.nextButtonText}>
            {step === 0 ? '인증번호 보내기' : '확인'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FindPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
  },
  backButton: { position: 'absolute', left: 15, top: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  inputContainer: { padding: 20, marginTop: 10 },
  label: { fontSize: 16, color: '#3384FF', marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#3384FF',
    marginBottom: 20,
    padding: 10,
    fontSize: 24,
  },
  errorText: { color: 'red', fontSize: 14, marginTop: -16, marginBottom: 16 },
  nextButton: {
    backgroundColor: '#3384FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 16 },
});
