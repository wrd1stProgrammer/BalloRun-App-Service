import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { Logout } from '../../redux/actions/userAction';
import { navigate } from '../../navigation/NavigationUtils';
import NoticeScreen from './NoticeScreen';

const ProfileScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // 캐리어 인증 상태 한글 매핑
  const getVerificationStatusText = (status:string) => {
    switch (status) {
      case 'pending':
        return '심사 중';
      case 'verified':
        return '인증 완료';
      case 'rejected':
        return '인증 거절';
      case 'notSubmitted':
        return '미제출';
      default:
        return '미제출';
    }
  };

  const handleAccountCheck = () => {
    if (!user?.account || Object.keys(user?.account || {}).length === 0) {
      Alert.alert(
        '계좌 등록 필요',
        '계좌가 등록되지 않았습니다. 계좌를 등록하시겠습니까?',
        [
          { text: '취소', style: 'cancel', onPress: () => {} },
          { text: '예', onPress: () => navigate('AccountRegistrationScreen'), style: 'default' },
        ],
        { cancelable: true }
      );
    } else {
      navigate('WithdrawScreen', { user });
    }
  };

  const handleEditProfile = () => {
    navigate('EditProfileScreen', { user });
  };

  const renderNoti = () => {
    navigate('NoticeScreen');
  };

  // 경험치 퍼센트 계산 함수
  const getExpPercentage = () => {
    if (!user?.level || !user?.exp) return 0;
    if (user.level === 1) return Math.min((user.exp / 100) * 100, 100); // 최대 100%
    if (user.level === 2) return Math.min((user.exp / 300) * 100, 100); // 최대 100%
    if (user.level === 3) return 100; // 레벨 3은 항상 100%
    return 0;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (고정) */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>마이배달</Text>
        <View style={styles.topBarIcons}>
          <TouchableOpacity onPress={() => console.log(user)} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 스크롤 가능한 전체 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.userImage }} style={styles.userImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userusername}>{user?.username}</Text>
            <View style={styles.membershipContainer}>
              <Text style={styles.membership}>포인트 : {user?.point || 0}</Text>
              {user?.verificationStatus === 'verified' && (
                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={handleAccountCheck}
                  activeOpacity={0.7}
                >
                  <Text style={styles.withdrawButtonText}>출금</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.status}>
              캐리어 인증상태 : {getVerificationStatusText(user?.verificationStatus)}
            </Text>
          </View>
        </View>

        {/* 프로필 수정 버튼 */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={20} color="#333" />
          <Text style={styles.editButtonText}>프로필 수정</Text>
        </TouchableOpacity>

        {/* 레벨 및 경험치 섹션 */}
        <View style={styles.levelSection}>
          <Text style={styles.gradeTitle}>등급 혜택</Text>
          <View style={styles.expRow}>
            <Text style={styles.expText}>Lv.{user?.level || 1}</Text>
            <Text style={styles.expText}>경험치 {getExpPercentage().toFixed(0)}%</Text>
          </View>
          <View style={styles.expContainer}>
            <View style={[styles.expBar, { width: `${getExpPercentage()}%` }]} />
          </View>
          <Text style={styles.expDetail}>
            {user?.exp || 0} / {user?.level === 1 ? 100 : user?.level === 2 ? 300 : '최대'}
          </Text>
        </View>

        {/* 메뉴 섹션 */}
        <View style={styles.menuSection}>
          {/* 이용안내 섹션 */}
          <Text style={styles.sectionTitle}>이용안내</Text>
          <TouchableOpacity style={styles.menuItem} onPress={renderNoti} activeOpacity={0.7}>
            <Ionicons name="volume-high" size={22} color="#333" />
            <Text style={styles.menuText}>공지사항</Text>
            {true && <View style={styles.notificationDot} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('설정')} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.menuText}>설정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('LawScreen')} activeOpacity={0.7}>
            <Ionicons name="document-text-outline" size={22} color="#333" />
            <Text style={styles.menuText}>약관 및 정책</Text>
          </TouchableOpacity>

          {/* 기타 섹션 */}
          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('정보 동의 설정')} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={22} color="#333" />
            <Text style={styles.menuText}>정보 동의 설정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('회원 탈퇴')} activeOpacity={0.7}>
            <Ionicons name="person-remove-outline" size={22} color="#333" />
            <Text style={styles.menuText}>회원 탈퇴</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(Logout())} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={22} color="#333" />
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // 배경색 변경
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#333',
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userusername: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginBottom: 6,
    color: '#333',
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  membership: {
    fontSize: 16,
    color: '#007bff',
    fontFamily: 'Roboto',
  },
  withdrawButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 30,
  },
  withdrawButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
  },
  editButton: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  levelSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  expDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'Roboto',
  },
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
  },
  expContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  expBar: {
    height: '100%',
    backgroundColor: '#00C4B4',
    borderRadius: 5,
  },
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
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginLeft: 16,
    fontFamily: 'Roboto',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginLeft: 8,
  },
});

export default ProfileScreen;