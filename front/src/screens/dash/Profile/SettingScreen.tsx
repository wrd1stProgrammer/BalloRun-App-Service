import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../../navigation/NavigationUtils';

const SettingScreen = ({ user }: { user: any }) => {
  const handleNavigate = (screen: string) => {
    navigate(screen);
  };

  const handleWithdraw = () => {
    navigate('TalTaeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 알림 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate('NotificationSettingsScreen')}
          >
            <Text style={styles.itemText}>알림 수신 설정</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* 계정 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 설정</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate('AccountManagementScreen')}
          >
            <Text style={styles.itemText}>계정/정보 관리</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate('BankAccountEditScreen')}
          >
            <Text style={styles.itemText}>계좌 정보 관리</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* 기타 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <Text style={styles.itemText}>앱 버전</Text>
            <Text style={styles.versionInfo}>1.0.0 (20250501)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={handleWithdraw}>
            <Text style={[styles.itemText, styles.withdrawText]}>탈퇴하기</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF7043" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: Platform.select({ ios: 3, android: 6 }),
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemText: {
    fontSize: 16,
    color: '#3C3C43',
  },
  versionInfo: {
    fontSize: 16,
    color: '#8E8E93',
  },
  withdrawText: {
    color: '#FF7043',
  },
});

export default SettingScreen;
