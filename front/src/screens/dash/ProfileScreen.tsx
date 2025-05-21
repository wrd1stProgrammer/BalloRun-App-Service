import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { Logout } from '../../redux/actions/userAction';
import { navigate } from '../../navigation/NavigationUtils';
import Modal from 'react-native-modal';

const ProfileScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  /* ────── helpers ────── */
  const statusKo = (s: string | undefined) =>
    ({ pending: '심사 중', verified: '인증 완료', rejected: '인증 거절' } as any)[s] ||
    '미제출';

  const expPct = () =>
    !user?.exp
      ? 0
      : user.level === 1
      ? Math.min((user.exp / 100) * 100, 100)
      : user.level === 2
      ? Math.min((user.exp / 300) * 100, 100)
      : 100;

  /* ────── actions ────── */
  const handleAccountCheck = () => {
    if (!user?.account || Object.keys(user.account).length === 0) {
      Alert.alert('계좌 등록 필요', '계좌를 등록하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '예', onPress: () => navigate('AccountRegistrationScreen') },
      ]);
    } else {
      navigate('WithdrawScreen', { user });
    }
  };

  const handleLogout = () =>
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '예', style: 'destructive', onPress: () => dispatch(Logout()) },
    ]);

  /* ────── render ────── */
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>내 정보</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? 60 : 40,
        }}
      >
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.userImage }} style={styles.userImage} />

          <View style={styles.userInfo}>
            <Text style={styles.userusername}>{user?.username}</Text>

            {/* 원금/포인트 + 출금 버튼 */}
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceText}>
                  원금 : {user?.originalMoney ?? 0}
                </Text>
                <Text style={styles.balanceText}>
                  포인트 : {user?.point ?? 0}
                </Text>
              </View>

              {user?.verificationStatus === 'verified' && (
                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={handleAccountCheck}
                >
                  <Text style={styles.withdrawButtonText}>출금</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.status}>
              캐리어 인증상태 : {statusKo(user?.verificationStatus)}
            </Text>
          </View>
        </View>

        {/* Edit profile */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigate('EditProfileScreen', { user })}
        >
          <Ionicons name="pencil-outline" size={20} color="#333" />
          <Text style={styles.editButtonText}>프로필 수정</Text>
        </TouchableOpacity>

        {/* Level */}
        <TouchableOpacity
          style={styles.levelSection}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.gradeTitleContainer}>
            <Text style={styles.gradeTitle}>등급 혜택</Text>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#202632"
              style={{ marginLeft: 6 }}
            />
          </View>
          <View style={styles.underline} />
          <View style={styles.expRow}>
            <Text style={styles.expText}>Lv.{user?.level ?? 1}</Text>
            <Text style={styles.expText}>경험치 {expPct().toFixed(0)}%</Text>
          </View>
          <View style={styles.expContainer}>
            <View style={[styles.expBar, { width: `${expPct()}%` }]} />
          </View>
          <Text style={styles.expDetail}>
            {user?.exp ?? 0} /{' '}
            {user?.level === 1 ? 100 : user?.level === 2 ? 300 : '최대'}
          </Text>
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>이용안내</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigate('NoticeScreen')}
          >
            <Ionicons name="volume-high" size={22} color="#333" />
            <Text style={styles.menuText}>공지사항</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigate('SettingScreen', { user })}
          >
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.menuText}>설정</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#333"
            />
            <Text style={styles.menuText}>정보 동의 설정</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigate('LawScreen')}
          >
            <Ionicons name="document-text-outline" size={22} color="#333" />
            <Text style={styles.menuText}>약관 및 정책</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#333" />
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Level Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>등급별 혜택</Text>
          {[
            { lv: 1, fee: '8%' },
            { lv: 2, fee: '7.5%' },
            { lv: 3, fee: '7%' },
          ].map(({ lv, fee }) => (
            <View style={styles.benefitItem} key={lv}>
              <Text style={styles.benefitLevel}>Lv.{lv}</Text>
              <Text style={styles.benefitText}>출금 수수료 {fee}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  /* Header */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  topBarTitle: { fontSize: 20, fontWeight: '600', color: '#333' },

  /* Profile */
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  userImage: { width: 90, height: 90, borderRadius: 45, marginRight: 20 },
  userInfo: { flex: 1 },
  userusername: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  balanceText: { fontSize: 16, color: '#007bff' },
  withdrawButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 4,
  },
  withdrawButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#666' },

  /* Edit button */
  editButton: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 10,
  },
  editButtonText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 8 },

  /* Level */
  levelSection: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  gradeTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  gradeTitle: { fontSize: 16, fontWeight: '600', color: '#202632' },
  underline: { width: 60, height: 1, backgroundColor: '#202632', marginVertical: 8 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  expText: { fontSize: 14, color: '#666' },
  expContainer: { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
  expBar: { height: '100%', backgroundColor: '#00C4B4', borderRadius: 5 },
  expDetail: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 4 },

  /* Menu */
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuText: { fontSize: 16, color: '#333', marginLeft: 16 },
  notificationDot: { width: 8, height: 8, backgroundColor: 'red', borderRadius: 4, marginLeft: 8 },

  /* Modal */
  modal: { justifyContent: 'center', margin: 0 },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 30,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '600', color: '#2B2B2B', marginBottom: 20 },
  benefitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  benefitLevel: { fontSize: 16, fontWeight: '600', color: '#3384FF' },
  benefitText: { fontSize: 16, color: '#2B2B2B' },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3384FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  closeButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
