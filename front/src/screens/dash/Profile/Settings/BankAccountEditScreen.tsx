import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../../redux/config/reduxHook';
import { updateBankAccountAction } from '../../../../redux/actions/userAction';
import { selectUser } from '../../../../redux/reducers/userSlice';

const BankAccountEditScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // user.account가 없을 경우 기본값 설정
  const [bankName, setBankName] = useState(user?.account?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(user?.account?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(user?.account?.holder || '');
  const [isLoading, setIsLoading] = useState(false);

  // 계좌 정보 저장 함수
  const handleSave = async () => {
    const bankInfo = {
      bankName,
      accountNumber,
      holder: accountHolder,
    };

    setIsLoading(true);
    try {
      await dispatch(updateBankAccountAction(bankInfo));
      Alert.alert('저장 완료', '계좌 정보가 업데이트되었습니다', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      // 에러는 updateBankAccountAction에서 Alert로 처리됨
    } finally {
      setIsLoading(false);
    }
  };

  // 화면 터치 시 키보드 내리기
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 화면 터치 감지 */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ flex: 1 }}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevron-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>계좌 정보 수정</Text>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0064FF" />
              ) : (
                <Text style={styles.saveButton}>저장</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            {/* 은행 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>은행</Text>
              <TextInput
                style={styles.input}
                value={bankName}
                onChangeText={setBankName}
                placeholder="은행 이름을 입력하세요"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

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
        </View>
      </TouchableWithoutFeedback>
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
  saveButtonContainer: {
    padding: 4,
  },
  saveButton: {
    fontSize: 16,
    color: '#0064FF',
    fontWeight: '500',
  },
  saveButtonDisabled: {
    opacity: 0.6,
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