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
        • Upload a complete image of your ID document.{'\n'}
        • Ensure all details are readable in the image you upload.{'\n'}
        • Ensure the document is the original and has not expired.{'\n'}
        • Place documents against a solid-colored background.
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('Step2')}
      >
        <Text style={authStyles.enableButtonText}>Continue</Text>
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