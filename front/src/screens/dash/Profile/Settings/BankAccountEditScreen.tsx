import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BankAccountEditScreen = () => {
  const navigation = useNavigation();
  const [bankName, setBankName] = useState('농협');
  const [accountNumber, setAccountNumber] = useState('3020632143041');
  const [accountHolder, setAccountHolder] = useState('채민식');

  // 은행 선택 함수 (더미)
  const handleSelectBank = () => {
    Alert.alert(
      '은행 선택',
      '은행 선택 기능이 구현될 예정입니다',
      [{ text: '확인' }]
    );
  };

  // 계좌 정보 저장 함수 (더미)
  const handleSave = () => {
    console.log('저장된 계좌 정보:', {
      bankName,
      accountNumber,
      accountHolder
    });
    Alert.alert(
      '저장 완료',
      '계좌 정보가 업데이트되었습니다',
      [{ 
        text: '확인',
        onPress: () => navigation.goBack()
      }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계좌 정보 수정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* 은행 선택 */}
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={handleSelectBank}
        >
          <Text style={styles.label}>은행</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputText}>{bankName}</Text>
            <Icon name="chevron-forward" size={20} color="#888" />
          </View>
        </TouchableOpacity>

        {/* 계좌번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>계좌번호</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="계좌번호를 입력하세요"
            keyboardType="number-pad"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* 예금주 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>예금주</Text>
          <TextInput
            style={styles.input}
            value={accountHolder}
            onChangeText={setAccountHolder}
            placeholder="예금주 이름을 입력하세요"
            autoCorrect={false}
          />
        </View>

        {/* 설명 텍스트 */}
        <Text style={styles.description}>
          ※ 정확한 계좌 정보를 입력해주세요. 입금 시 사용됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  saveButton: {
    fontSize: 16,
    color: '#0064FF',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 12,
  },
  description: {
    fontSize: 12,
    color: '#888',
    marginTop: 24,
    textAlign: 'center',
  },
});

export default BankAccountEditScreen;