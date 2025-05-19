import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step1Content: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      {/* 로딩바 아래에 제목 추가 */}
      <Text style={authStyles.title}>주민등록증 인증</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="id-card" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
        주민등록증을 준비해주세요!
      </Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="person" size={100} color="#666" />
      </View>

      <Text style={authStyles.description}>
        • 주민등록증 전체 이미지를 업로드합니다.{'\n'}
        • 문서가 원본인지 확인합니다.{'\n'}
        • 실물 주민등록증을 준비해주세요.
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('Step2')}
      >
        <Text style={authStyles.enableButtonText}>다음 </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step1: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={1} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step1Content />
    </View>
  );
};

// 로컬 스타일은 더 이상 필요 없음
export default Step1;