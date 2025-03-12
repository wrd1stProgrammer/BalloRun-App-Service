import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { Logout, taltaeAction } from '../../../redux/actions/userAction';
interface Route {
    route: {
      params: {
        user: any;
      };
    };
  }

const TalTaeScreen: React.FC<Route> = ({route}) => {
  const [reason, setReason] = useState<string>('');
  const user = route.params.user;
  const dispatch = useAppDispatch();


  const handleCancel = () => {
    goBack();
  };

  const handleWithdraw = async() => {
    if (!reason.trim()) {
      Alert.alert('오류', '탈퇴 사유를 입력해주세요.');
      return;
    }
    Alert.alert(
      '탈퇴 확인',
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel', onPress: async() => {} },
        {
          text: '확인',
          style: 'destructive',
          onPress: async() => {
            // 탈퇴 로직 (예: API 호출)
            await dispatch(taltaeAction(reason));
            console.log('탈퇴 처리 완료');
            //await Logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>탈퇴하기</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            {user?.username}님 떠나지 말아요..
          </Text>
          <Text style={styles.infoText}>
            계정을 삭제하면 관련 모든 활동 기록이 7일 이내 삭제됩니다. 계정 삭제 후 3일 후 다시 재가입 할 수 있어요.
          </Text>
          <Text style={styles.infoText}>
           {user?.username}님이 계정을 삭제하려는 이유가 궁금해요.
          </Text>
        </View>

        <View style={styles.reasonSection}>
          <Text style={styles.reasonTitle}>탈퇴하시는 이유를 알려주세요.</Text>
          <TextInput
            style={styles.textInput}
            value={reason}
            onChangeText={(text) => setReason(text.slice(0, 100))} // 100자 제한
            placeholder="탈퇴 사유를 입력해주세요 (100자 이내)"
            placeholderTextColor="#8E8E93"
            multiline
            maxLength={100}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{`${reason.length}/100`}</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !reason.trim() && styles.disabledButton]}
          onPress={handleWithdraw}
          disabled={!reason.trim()}
        >
          <Text style={styles.submitButtonText}>제출</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 토스 스타일 부드러운 배경
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: Platform.select({ ios: 3, android: 6 }), // iOS와 Android 비율 조정
  },
  infoText: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 22,
    marginBottom: 8,
  },
  reasonSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: Platform.select({ ios: 3, android: 6 }),
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  textInput: {
    height: 120, // 더 넉넉한 입력 공간
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: Platform.select({ ios: 1, android: 2 }),
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#FF7043', // 토스 스타일 오렌지 계열
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.select({ ios: 2, android: 4 }),
  },
  disabledButton: {
    backgroundColor: '#FFB4A2', // 비활성화 시 연한 오렌지
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TalTaeScreen;