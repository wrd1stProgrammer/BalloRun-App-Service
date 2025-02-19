import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { goBack } from '../../../navigation/NavigationUtils';

const RiderManual: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 추가 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
      <Text style={styles.title}>편한 심부름 편부름</Text>
      </View>

      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={50} color="#666" />
      </View>

      <Text style={styles.description}>
        우리 앱을 쓰려면 뭐 여러가지 인증을 해야된다는 내용을 써야 함.
      </Text>

      <TouchableOpacity style={styles.learnMoreButton} onPress={() => console.log('Learn More pressed')}>
        <Ionicons name="information-circle-outline" size={16} color="#666" style={styles.learnMoreIcon} />
        <Text style={styles.learnMoreText}>How to enable Authenticator App</Text>
        <Text style={styles.learnMoreLink}>Learn More</Text>
      </TouchableOpacity>

      {/* Enable 버튼을 맨 아래에 넓게 배치 (80% 너비, 중앙 정렬) */}
      <TouchableOpacity style={[styles.wideEnableButton, { width: screenWidth * 0.8, marginHorizontal: '10%' }]} onPress={() => console.log('Enable pressed')}>
        <Text style={styles.enableButtonText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  headerContainer: {
    marginVertical: 30,
    alignItems: 'flex-start',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  learnMoreIcon: {
    marginRight: 5,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 5,
  },
  learnMoreLink: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  wideEnableButton: {
    backgroundColor: '#FFC107', // 노란색 버튼
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});

export default RiderManual;