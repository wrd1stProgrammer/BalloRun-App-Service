import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate,goBack } from '../../../navigation/NavigationUtils';


const AccountRegistrationScreen: React.FC = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
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
        <TouchableOpacity style={styles.registerButton}>
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