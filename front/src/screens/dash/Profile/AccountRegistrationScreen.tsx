import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet ,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate,goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { refetchUser, registerAccount } from '../../../redux/actions/userAction';

const AccountRegistrationScreen: React.FC = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState(0);
  const [holder, setHolder] = useState('');
  const dispatch = useAppDispatch();

  const submitAccountHandler = async() => {
    if (!bankName.trim()) {
      Alert.alert('입력 오류', '은행명을 입력해주세요.');
      return;
    }
    if (accountNumber === 0) { // default 0 이라서.
      Alert.alert('입력 오류', '계좌번호를 입력해주세요.');
      return;
    }
    if (!holder.trim()) {
      Alert.alert('입력 오류', '예금주를 입력해주세요.');
      return;
    }

    // 모든 필드가 입력되었을 때 처리 로직 (예: API 호출, 데이터 저장)
    // user 업뎃 뒤로가서 user refetch?
    await dispatch(registerAccount(bankName,accountNumber,holder));
    await dispatch(refetchUser()); // user 상태 새로고침.
    Alert.alert('성공', '계좌가 성공적으로 등록되었습니다.', [
      { text: '확인', onPress: () => goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계좌 등록</Text>
      </View>
      <View style={styles.content}>
        {/* 은행명 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>은행명</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 우리은행"
            value={bankName}
            onChangeText={setBankName}
          />
        </View>

        {/* 계좌번호 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>계좌번호</Text>
          <TextInput
            style={styles.input}
            placeholder="숫자만 입력 (예: 1234567890)"
            keyboardType="numeric"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        {/* 예금주 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>예금주</Text>
          <TextInput
            style={styles.input}
            placeholder="이름 입력"
            value={holder}
            onChangeText={setHolder}
          />
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity style={styles.registerButton} onPress={submitAccountHandler}>
          <Text style={styles.registerButtonText}>등록하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  content: { padding: 16 },
  inputSection: { marginBottom: 16 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AccountRegistrationScreen;