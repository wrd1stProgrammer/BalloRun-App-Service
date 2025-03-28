import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from './AuthStepsStyles';
import { goBack } from '../../../navigation/NavigationUtils';

interface AuthHeaderProps {
  step: number; // 현재 단계 (1~6)
  totalSteps: number; // 총 단계 수 (6)
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100; // 진행률 계산 (0~100%)

  return (
    <View style={[authStyles.header, { zIndex: 1 }]}>
      <TouchableOpacity style={authStyles.backButton} onPress={() => goBack()}>
      <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>
      <View style={authStyles.progressBarContainer}>
        <View style={[authStyles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

export default AuthHeader;