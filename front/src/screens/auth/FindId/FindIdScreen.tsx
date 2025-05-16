// src/screens/auth/FindIdScreen.tsx
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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack, resetAndNavigate } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { findIdByUserInfoAction } from '../../../redux/actions/userAction';

const FindIdScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null);

  const dispatch = useAppDispatch();


  const handleConfirm = async () => {
    // 입력 검증
    let valid = true;
    if (!name.trim()) {
      setNameError('이름을 입력해주세요');
      valid = false;
    }
    if (!phone.trim()) {
      setPhoneError('휴대전화번호를 입력해주세요');
      valid = false;
    }
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요');
      valid = false;
    }
    if (!valid) return;

    // 아이디 찾기
    const id = await dispatch(findIdByUserInfoAction(name,Number(phone),email));
    if (id) {
      setFoundId(id);
      setModalMessage(`귀하의 아이디는\n"${id}" 입니다.`);
    } else {
      setFoundId(null);
      setModalMessage('일치하는 정보가 없습니다.');
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (foundId) {
      // 찾았으면 로그인 화면으로 리셋 내비게이트
      resetAndNavigate('Login');
    } else {
      // 못 찾았으면 다시 입력 단계로
      // (필요 시 필드 초기화)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>아이디 찾기</Text>
        </View>

        {/* 입력란 */}
        <View style={styles.inputContainer}>
          {/* 이름 */}
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setNameError('');
            }}
            maxLength={10}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* 휴대전화번호 */}
          <Text style={styles.label}>휴대전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="01012345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              setPhoneError('');
            }}
            maxLength={11}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          {/* 이메일 */}
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="example@domain.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailError('');
            }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity style={styles.nextButton} onPress={handleConfirm}>
          <Text style={styles.nextButtonText}>확인</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* 결과 모달 */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FindIdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  inputContainer: {
    padding: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#3384FF',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#3384FF',
    marginBottom: 20,
    padding: 10,
    fontSize: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
  },
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  modalButton: {
    backgroundColor: '#3384FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
