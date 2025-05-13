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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ThirdScreen: { name: string; nickname: string; id: string; password: string; email: string };
};

type ThirdScreenProps = NativeStackScreenProps<RootStackParamList, 'ThirdScreen'>;

const ThirdScreen = ({ route }: ThirdScreenProps) => {
  const { name, nickname, id, email, password } = route.params;

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showResend, setShowResend] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showCode && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowResend(true);
    }
  }, [showCode, timeLeft]);

  const signInWithPhoneNumber = async () => {
    try {
      if (!phone || phone.length < 11) {
        setError('유효한 전화번호를 입력해주세요 (예: 01012345678)');
        return;
      }
      const formattedPhone = '+82' + phone.slice(1);
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setShowCode(true);
      setTimeLeft(180);
      setShowResend(false);
      setError('');
    } catch (e: any) {
      setError('전화번호 인증에 실패했습니다: ' + e.message);
    }
  };

  const confirmCode = async () => {
    try {
      if (!confirm) {
        setError('인증 요청이 없습니다. 다시 시도해주세요');
        return;
      }
      await confirm.confirm(code);
      navigate('FourthScreen', { name, nickname, id, email, password, phone });
    } catch {
      setError('인증번호가 잘못되었습니다');
    }
  };

  const handleNext = async () => {
    if (!showCode) {
      auth().settings.appVerificationDisabledForTesting = false;
      await signInWithPhoneNumber();
    } else {
      await confirmCode();
    }
  };

  const handleResend = async () => {
    await signInWithPhoneNumber();
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>본인정보 입력</Text>
          </View>

          {/* 입력란 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="휴대폰 번호"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {showCode && (
              <>
                <Text style={styles.label}>인증번호</Text>
                <View style={styles.codeContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="인증번호"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                  />
                  <Text style={styles.timer}>{formatTime()}</Text>
                </View>
              </>
            )}

            {showResend && (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>재전송</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 다음 버튼 */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#3384FF',
    justifyContent: 'center',
  },
  backButton: { position: 'absolute', left: 15, top: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2526' },
  inputContainer: { padding: 20, marginTop: 10 },
  label: { fontSize: 16, color: '#3384FF', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#3384FF', marginBottom: 30, padding: 10, fontSize: 24 },
  codeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timer: { color: '#3384FF', fontSize: 16, marginLeft: 10 },
  resendText: { color: '#3384FF', fontSize: 14, marginBottom: 20 },
  nextButton: { backgroundColor: '#3384FF', padding: 15, borderRadius: 8, alignItems: 'center', position: 'absolute', bottom: 20, left: 20, right: 20 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16 },
  errorText: { color: 'red', fontSize: 14, marginTop: -20, marginBottom: 20 },
});

export default ThirdScreen;
