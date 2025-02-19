import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step6Content: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={authStyles.title}>배달원 등록 완료!</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="shield-checkmark" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
        관리자가 검토하여 최대 1시간 안에 승인 여부를 확인할 수 있습니다.
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('HomeScreen')} // 홈 화면으로 이동 (실제 경로에 맞게 수정)
      >
        <Text style={authStyles.enableButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step6: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={6} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step6Content />
    </View>
  );
};

export default Step6;