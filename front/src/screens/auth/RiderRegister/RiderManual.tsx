import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { goBack, navigate } from '../../../navigation/NavigationUtils';

const screenWidth = Dimensions.get('window').width;

const RiderManual: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 영역 */}
      <View style={styles.headerRow}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.backButton}
          hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
        >
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        {/* 가운데 타이틀 */}
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.title}>발로뛰어 !</Text>
        </View>
        {/* 오른쪽 공간 맞추기 */}
        <View style={styles.rightSpacer} />
      </View>

      {/* 본문 컨텐츠 */}
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={54} color="#666" style={styles.lockIcon} />
        <Text style={styles.description}>
          발로뛰어 래너(배달원)가 되려면 다음 내용을 따라 주십시오
        </Text>
      </View>

      {/* 하단 등록 버튼 */}
      <TouchableOpacity
        style={[styles.wideEnableButton, { width: screenWidth * 0.8 }]}
        onPress={() => navigate('Step1')}
        activeOpacity={0.85}
      >
        <Text style={styles.enableButtonText}>등록하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    marginBottom: 16,
    height: 56,
    borderBottomColor: '#eee',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  rightSpacer: {
    width: 40, // backButton과 맞추기용
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  lockIcon: {
    marginBottom: 22,
    marginTop: 30,
  },
  description: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  wideEnableButton: {
    backgroundColor: '#3384FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Platform.OS === 'ios' ? 38 : 24,
    height: 52,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default RiderManual;
