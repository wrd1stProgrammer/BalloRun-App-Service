import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step3Content: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={authStyles.title}>업로드 성공!</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
        주민등록증이 안전하게 업로드 되었습니다
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('Step4')}
      >
        <Text style={authStyles.enableButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step3: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={3} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step3Content />
    </View>
  );
};

export default Step3;