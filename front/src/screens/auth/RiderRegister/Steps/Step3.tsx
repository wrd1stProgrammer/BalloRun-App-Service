import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';

const Step3Content: React.FC<{ images?: string | null }> = ({ images }) => {
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={authStyles.title}>업로드 성공!</Text>

      <View style={authStyles.iconContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#666" />
      </View>

      <Text style={authStyles.description}>
      주민등록증이 안전하게 업로드 되었습니다.{'\n'}
      다음 단계에서 얼굴 본인인증을 위해 사진 촬영을 시작합니다.
      </Text>

      <TouchableOpacity
        style={authStyles.wideEnableButton}
        onPress={() => navigate('Step4',{images})}
      >
        <Text style={authStyles.enableButtonText}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step3: React.FC<{ route: any }> = ({ route }) => {
  const images = route.params?.images; // route.params에서 images 추출
  console.log(images);
  return (
    <View style={{ flex: 1 }}>
      {/* 고정된 헤더 */}
      <AuthHeader step={3} totalSteps={6} />
      
      {/* 스크롤 가능한 본문 컨텐츠 */}
      <Step3Content images={images}/>
    </View>
  );
};

export default Step3;