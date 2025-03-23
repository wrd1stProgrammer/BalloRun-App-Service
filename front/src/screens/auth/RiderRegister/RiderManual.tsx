import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions, Platform } from 'react-native';
import { goBack, navigate } from '../../../navigation/NavigationUtils';
import { authStyles } from './AuthStepsStyles'; // 공통 스타일 사용

const RiderManual: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={authStyles.container}>
      {/* 뒤로가기 버튼 추가 */}
      <TouchableOpacity style={authStyles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={authStyles.headerContainer}>
        <Text style={authStyles.title}>발로뛰어 !</Text>
      </View>

      <View style={authStyles.iconContainer}>
        <Ionicons name="lock-closed" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
        우리 앱을 쓰려면 뭐 여러가지 인증을 해야된다는 내용을 써야 함.
      </Text>

      <TouchableOpacity style={authStyles.learnMoreButton} onPress={() => console.log('Learn More pressed')}>
        <Ionicons name="information-circle-outline" size={16} color="#666" style={authStyles.learnMoreIcon} />
        <Text style={authStyles.learnMoreText}>How to enable Authenticator App</Text>
        <Text style={authStyles.learnMoreLink}>Learn More</Text>
      </TouchableOpacity>

      {/* Enable 버튼을 맨 아래에 넓게 배치 (80% 너비, 중앙 정렬) */}
      <TouchableOpacity style={[authStyles.wideEnableButton, { width: screenWidth * 0.8 }]} onPress={() => navigate('Step1')}>
        <Text style={authStyles.enableButtonText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

// 로컬 스타일은 더 이상 필요 없으므로 제거 (authStyles로 통합)
export default RiderManual;