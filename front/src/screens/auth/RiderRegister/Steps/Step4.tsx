import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step4Content: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={[authStyles.title, { textAlign: 'center' }]}>얼굴 인증</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="person-circle" size={50} color="#666" />
      </View>

      <Text style={[authStyles.description, { textAlign: 'center', marginBottom: 20 }]}>얼굴 정면 사진을 찍어주세요</Text>

      <TouchableOpacity
        style={[styles.optionButton, { marginBottom: 10 }]}
        onPress={() => navigate('Step5')}
      >
        <Ionicons name="camera" size={20} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.optionButtonText}>사진 찍기</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[authStyles.wideEnableButton, { backgroundColor: '#FFC107', marginTop: 30 }]}
        onPress={() => navigate('Step5')}
      >
        <Text style={authStyles.enableButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step4: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={4} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step4Content />
    </View>
  );
};

// 새로운 스타일 추가
const styles = StyleSheet.create({
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1', // 밝은 노란색 배경 (스크린샷에서 버튼 배경과 유사)
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700', // 노란색 테두리
    width: '90%',
    marginHorizontal: '5%',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'left',
  },
});

export default Step4;