import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
// import { checkUserIdDuplicateAction, checkEmailDuplicateAction } from '../../../redux/actions/userAction';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  SecondScreen: { name: string; nickname: string }; // 전달받을 파라미터 타입
};

type SecondScreenProps = NativeStackScreenProps<RootStackParamList, 'SecondScreen'>;

const SecondScreen = ({route}: SecondScreenProps) => {
  const { name, nickname } = route.params;

  const [id, setId] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(0);
  const [idError, setIdError] = useState('');
  // const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  
  const dispatch = useAppDispatch();

  // 아이디 유효성 검증
  const checkIdValidity = (value: string) => {
    const trimmedValue = value.trim();
    const regex = /^[a-z0-9]+$/; // 소문자와 숫자만 허용
    return trimmedValue.length > 0 && trimmedValue.length <= 10 && regex.test(trimmedValue);
  };

  // 비밀번호 유효성 검증
  const checkPasswordValidity = (value: string) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return value.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };

  // 중복 검증 함수
  const checkIdDuplicate = async (value: string) => {
    const userId = value.trim();
    // const isDup = await dispatch(checkUserIdDuplicateAction(userId));
    // return isDup.available;
    return true; // 임시로 항상 통과
  };

  // const checkEmailDuplicate = async (value: string) => {
  //   const email = value.trim();
  //   const isDup = await dispatch(checkEmailDuplicateAction(email));
  //   return isDup.available;
  // };

  const handleNext = async () => {
    if (step === 0) {
      if (!id) {
        setIdError('아이디를 입력해주세요');
      } else if (!checkIdValidity(id)) {
        setIdError('아이디는 영어 소문자와 숫자만 가능하며 최대 10글자입니다');
      } else {
        const isIdAvailable = await checkIdDuplicate(id);
        if (isIdAvailable) {
          setIdError('');
          setStep(2); // 이메일 스킵하고 바로 비밀번호 단계로 이동
        } else {
          setIdError('이미 사용 중인 아이디입니다');
        }
      }
    // } else if (step === 1) {
    //   if (!email) {
    //     setEmailError('이메일을 입력해주세요');
    //   } else if (!checkEmailValidity(email)) {
    //     setEmailError('유효한 이메일 형식을 입력해주세요');
    //   } else {
    //     const isEmailAvailable = await checkEmailDuplicate(email);
    //     if (isEmailAvailable) {
    //       setEmailError('');
    //       setStep(2);
    //     } else {
    //       setEmailError('이미 사용 중인 이메일입니다');
    //     }
    //   }
    } else if (step === 2) {
      if (!password) {
        setPasswordError('비밀번호를 입력해주세요');
      } else if (!checkPasswordValidity(password)) {
        setPasswordError('비밀번호는 문자, 숫자, 특수문자를 포함해 최소 8글자 이상이어야 합니다');
      } else {
        setPasswordError('');
        setStep(3);
      }
    } else if (step === 3) {
      if (!confirmPassword) {
        setPasswordMatch('비밀번호를 다시 입력해주세요');
      } else if (password !== confirmPassword) {
        setPasswordMatch('비밀번호가 일치하지 않습니다');
      } else {
        // navigate('ThirdScreen',{name,nickname,id,email,password});
        navigate('ThirdScreen',{name,nickname,id,email:'',password});
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
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>본인정보 입력</Text>
        </View>

        {/* 입력란 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={id}
            onChangeText={(text) => {
              // 영어 소문자, 숫자만 허용하고 대문자는 자동 소문자 변환
              const lower = text.replace(/[^a-z0-9]/gi, '').toLowerCase();
              setId(lower);
              setIdError('');
            }}
            maxLength={10}
            autoCapitalize="none"
          />
          {idError && <Text style={styles.errorText}>{idError}</Text>}

          {/* 이메일 입력란 전체 주석
          {step >= 1 && (
            <>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
              />
              {emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </>
          )}
          */}

          {step >= 2 && (
            <>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                secureTextEntry
              />
              {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </>
          )}

          {step >= 3 && (
            <>
              <Text style={styles.label}>비밀번호 재입력</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordMatch('');
                }}
                secureTextEntry
              />
              {passwordMatch && <Text style={styles.errorText}>{passwordMatch}</Text>}
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
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#3384FF',
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
    color: '#1C2526',
    textAlign: 'center',
  },
  inputContainer: {
    padding: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#3384FF',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#3384FF',
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
});

export default SecondScreen;
