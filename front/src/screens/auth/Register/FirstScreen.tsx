import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { checkNicknameDuplicateAction } from '../../../redux/actions/userAction';

const FirstScreen = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [showNickname, setShowNickname] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const dispatch = useAppDispatch();

  // 이름 유효성 검증 함수
  const checkNameValidity = (value: string) => {
    const trimmedValue = value.trim();
    const regex = /^[a-zA-Z0-9가-힣]+$/; // 영어, 한글, 숫자만 허용
    if (trimmedValue.length === 0) {
      return false; // 비어있으면 유효하지 않음
    }
    if (trimmedValue.length > 10) {
      return false; // 10글자 초과 시 유효하지 않음
    }    
    if (!regex.test(trimmedValue)) {
      return false; // 영어, 한글, 숫자 외 문자 포함 시 유효하지 않음
    }
    return true; // 조건 충족 시 유효
  };

  // 닉네임 유효성 검증 함수
  const checkNicknameValidity = (value: string) => {
    const trimmedValue = value.trim();
    const regex = /^[a-zA-Z0-9가-힣]+$/; // 영어, 한글, 숫자만 허용
    if (trimmedValue.length === 0) {
      return false; // 비어있으면 유효하지 않음
    }
    if (trimmedValue.length > 10) {
      return false; // 10글자 초과 시 유효하지 않음
    }
    if (!regex.test(trimmedValue)) {
      return false; // 영어, 한글, 숫자 외 문자 포함 시 유효하지 않음
    }
    return true; // 조건 충족 시 유효
  };

  // 닉네임 중복 검증 함수
  const checkNicknameDuplicate = async (value: string) => {
    const nickname = value.trim();
    const isCanUse = await dispatch(checkNicknameDuplicateAction(nickname));
    console.log(isCanUse.available);
    return isCanUse.available; // 중복이 아니면 true 반환
  };

  const handleNext = async () => {
    if (!showNickname) {
      if (!name) {
        setNameError('이름을 입력해주세요');
      } else if (!checkNameValidity(name)) {
        setNameError('이름은 최대 10글자까지 가능합니다');
      } else {
        setShowNickname(true);
        setNameError('');
      }
    } else {
      if (!nickname) {
        setNicknameError('닉네임을 입력해주세요');
      } else if (!checkNicknameValidity(nickname)) {
        setNicknameError('닉네임은 영어, 한글, 숫자만 사용 가능하며 최대 10글자입니다');
      } else {
        const isNicknameAvailable = await checkNicknameDuplicate(nickname);
        if (isNicknameAvailable) {
          navigate('SecondScreen',{name,nickname}); // 중복 없으면 이동
        } else {
          setNicknameError('이미 사용 중인 닉네임입니다');
        }
      }
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
            <Ionicons name="arrow-back" size={24} color="#1C2526" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>본인정보 입력</Text>
        </View>

        {/* 입력란 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError(''); // 입력 중 에러 초기화
            }}
            maxLength={10} // 최대 10글자 제한
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}

          {showNickname && (
            <>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                placeholder="닉네임"
                value={nickname}
                onChangeText={(text) => {
                  setNickname(text);
                  setNicknameError(''); // 입력 중 에러 초기화
                }}
                maxLength={10} // 최대 10글자 제한
              />
              {nicknameError && <Text style={styles.errorText}>{nicknameError}</Text>}
            </>
          )}
        </View>

        {/* 다음 버튼 */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#fff', // 화면 배경과 동일한 흰색으로 설정
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#fff', // 화면 배경과 동일한 흰색으로 설정
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
    textAlign: 'center',
  },
  inputContainer: {
    padding: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#0064FF',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#0064FF',
    marginBottom: 30,
    padding: 10,
    fontSize: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -20,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#0064FF',
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
});

export default FirstScreen;
