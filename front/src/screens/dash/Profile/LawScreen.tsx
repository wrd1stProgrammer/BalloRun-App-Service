import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack,navigate } from '../../../navigation/NavigationUtils';

const LawScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (뒤로 가기 아이콘 포함) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>약관 및 정책</Text>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("TermsScreen")} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={22} color="#333" />
          <Text style={styles.menuText}>서비스 이용약관</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("PrivacyPolicy")} activeOpacity={0.7}>
          <Ionicons name="lock-closed-outline" size={22} color="#333" />
          <Text style={styles.menuText}>개인 정보 처리 방침</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("PrivacyConsentScreen")} activeOpacity={0.7}>
          <Ionicons name="document-outline" size={22} color="#333" />
          <Text style={styles.menuText}>개인 정보 수집 및 이용 동의</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("LocationServiceTermsScreen")} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={22} color="#333" />
          <Text style={styles.menuText}>위치기반서비스 이용약관</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("CarrierAgreementScreen")} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={22} color="#333" />
          <Text style={styles.menuText}>캐리어 업무위수탁약관</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    marginRight: 10, // 타이틀과의 간격
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#333',
    flex: 1, // 타이틀이 중앙에 오도록
    textAlign: 'center', // 타이틀 중앙 정렬
  },
  menuSection: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginLeft: 20,
    fontFamily: 'Roboto',
  },
});

export default LawScreen;