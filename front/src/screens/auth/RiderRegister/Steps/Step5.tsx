import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step5Content: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={authStyles.title}>업로드 성공!</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
        인증에 사용된 사진들은 확인 및 보관용도 외 사용하지 않습니다
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('Step6')}
      >
        <Text style={authStyles.enableButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step5: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={5} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step5Content />
    </View>
  );
};

export default Step5;