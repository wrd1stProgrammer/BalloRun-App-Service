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
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { verifyEmail } from '../../../redux/actions/userAction';

type RootStackParamList = {
  ThirdScreen: { name: string; nickname: string; id: string; password: string; email: string };
};

type ThirdScreenProps = NativeStackScreenProps<RootStackParamList, 'ThirdScreen'>;

const ThirdScreen = ({ route }: ThirdScreenProps) => {
  const dispatch = useAppDispatch();
  const { name, nickname, id, email, password } = route.params;

  // 'phone' 변수명은 유지(실제로는 email)
  const [phone, setPhone] = useState(email || '');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState<0 | 1>(0);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // 3분
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 1 && timer > 0) {
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
  }, [step, timer]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // 이메일 인증코드 발송
  const handleSendCode = async () => {
    if (isSending) return;
    setError('');
    if (!phone.trim() || !phone.includes('@')) {
      setError('유효한 이메일을 입력해주세요');
      return;
    }
    setIsSending(true);
    try {
      // verifyEmail action이 실제로 인증코드를 반환해야 함
      const returnedCode = await dispatch(verifyEmail(phone));
      setSentCode(returnedCode || '');
      setStep(1);
      setTimer(180);
    } catch {
      setError('인증번호 전송에 실패했습니다');
    }
    setIsSending(false);
  };

  // 인증코드 검증
  const handleVerify = () => {
    if (timer === 0) {
      setError('인증 시간이 만료되었습니다. 다시 요청해주세요.');
    } else if (code === sentCode) {
      navigate('FourthScreen', { name, nickname, id, email: phone, password });
    } else {
      setError('인증번호가 일치하지 않습니다');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>본인정보 입력</Text>
          </View>

          <View style={styles.inputContainer}>
            {step === 0 && (
              <View>
                <Text style={styles.label}>이메일 주소</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={phone}
                  onChangeText={t => {
                    setPhone(t);
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
              (step === 1 && timer === 0) || isSending ? { backgroundColor: '#aaa' } : {},
            ]}
            onPress={step === 0 ? handleSendCode : handleVerify}
            disabled={step === 1 && timer === 0 || isSending}
            activeOpacity={isSending ? 1 : 0.8}
          >
            {isSending ? (
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
            ) : null}
            <Text style={styles.nextButtonText}>
              {isSending
                ? ''
                : step === 0
                  ? '인증번호 보내기'
                  : '확인'}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ThirdScreen;

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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2526' },
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 16 },
});
