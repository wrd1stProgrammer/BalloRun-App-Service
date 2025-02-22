import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate,goBack } from '../../../navigation/NavigationUtils';
interface User {
  account?: {
    bankName: string;
    accountNumber: string;
    holder: string;
  };
}

interface WithdrawScreenProps {
  user: User;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ user }) => {
  const [amount, setAmount] = useState('');

  // 더미 출금 내역 데이터
  const dummyHistory = [
    { id: '1', date: '2023-10-01', amount: '₩50,000', status: '완료' },
    { id: '2', date: '2023-09-25', amount: '₩30,000', status: '처리중' },
  ];



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>출금</Text>
      </View>
      <View style={styles.content}>
        {/* 계좌 정보 */}
        <View style={styles.accountInfo}>
          <Text style={styles.infoLabel}>은행명</Text>
          <Text style={styles.infoValue}>{user?.account?.bankName}</Text>
          <Text style={styles.infoLabel}>계좌번호</Text>
          <Text style={styles.infoValue}>{user?.account?.accountNumber}</Text>
          <Text style={styles.infoLabel}>예금주</Text>
          <Text style={styles.infoValue}>{user?.account?.holder}</Text>
        </View>

        {/* 출금 금액 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>출금 금액 입력 (KRW)</Text>
          <TextInput
            style={styles.input}
            placeholder="₩0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* 출금 버튼 */}
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>출금하기</Text>
        </TouchableOpacity>

        {/* 출금 내역 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>출금 내역</Text>
          <FlatList
            data={dummyHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyAmount}>{item.amount}</Text>
                <Text style={styles.historyStatus}>{item.status}</Text>
              </View>
            )}
          />
        </View>
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
  accountInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
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
  withdrawButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  historySection: { marginTop: 16 },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: { fontSize: 14, color: '#666' },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  historyStatus: { fontSize: 14, color: '#4CAF50' },
});

export default WithdrawScreen;