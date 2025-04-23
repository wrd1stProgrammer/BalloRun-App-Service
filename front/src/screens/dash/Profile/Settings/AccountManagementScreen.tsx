import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../../../../redux/config/reduxHook';
import { selectUser } from '../../../../redux/reducers/userSlice';
import { goBack } from '../../../../navigation/NavigationUtils';

const AccountManagementScreen = () => {
  const user = useAppSelector(selectUser);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계정 관리</Text>
        <View style={styles.saveButtonPlaceholder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* 계정 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 정보</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>닉네임</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{user?.nickname}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>아이디</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{user?.userId}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이메일</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>계정 상태</Text>
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationText}>
                {user?.verificationStatus === 'verified' ? '인증 완료' : '인증 필요'}
              </Text>
            </View>
          </View>
        </View>

        {/* 배송 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배송 정보</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>주소</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user?.address} {user?.detail}
              </Text>
            </View>
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>배송 메모</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user?.riderNote || '배송 메모가 없습니다.'}
              </Text>
            </View>
          </View>
        </View>

        {/* 라이더 정보 섹션 */}
        {user?.isRider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>라이더 정보</Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>라이더 상태</Text>
              <Text style={styles.infoValue}>
                {user.isDelivering ? '배달 중' : '대기 중'}
              </Text>
            </View>

            <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>진행 중인 주문</Text>
              <Text style={styles.infoValue}>
                {user.isOngoingOrder ? '있음' : '없음'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  saveButtonPlaceholder: { width: 40 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  infoLabel: { fontSize: 15, color: '#666', flex: 1 },
  infoValue: { fontSize: 15, color: '#333', fontWeight: '500', textAlign: 'right' },
  verificationBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verificationText: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },
});

export default AccountManagementScreen;
