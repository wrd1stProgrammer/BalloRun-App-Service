import React, { useState } from 'react';
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
import { goBack, resetAndNavigate } from '../../../navigation/NavigationUtils';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { resetPasswordAction } from '../../../redux/actions/userAction';

const ResetPasswordScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await dispatch(resetPasswordAction(password,email));
      resetAndNavigate('Login');
    } catch {
      setError('비밀번호 변경에 실패했습니다');
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
          <Text style={styles.headerTitle}>새 비밀번호 설정</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 입력"
            secureTextEntry
            value={password}
            onChangeText={t => {
              setPassword(t);
              setError('');
            }}
          />
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            secureTextEntry
            value={confirm}
            onChangeText={t => {
              setConfirm(t);
              setError('');
            }}
          />
          {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>확인</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
