import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { Logout } from '../../redux/actions/userAction';
import { ScrollView } from 'react-native-gesture-handler';
import { navigate } from '../../navigation/NavigationUtils';

const ProfileScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleAccountCheck = () => {
    console.log(user)
    if (!user?.account || Object.keys(user?.account || {}).length === 0) {

      Alert.alert(
        '계좌 등록 필요',
        '계좌가 등록되지 않았습니다. 계좌를 등록하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
            onPress: () => {}, // 취소 버튼 클릭 시 아무 작업도 하지 않음
          },
          {
            text: '예',
            onPress: () => navigate('AccountRegistrationScreen'),
            style: 'default',
          },
        ],
        { cancelable: true }
      );
    } else {
      navigate('WithdrawScreen', {user});
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>마이배달</Text>
        <TouchableOpacity onPress={() => dispatch(Logout())} style={styles.settingsIcon} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.topBarIcons}>
          <TouchableOpacity onPress={() => console.log(user)} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

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
          <Text style={styles.status}>송달사 인증상태 : {user?.verificationStatus || '미인증'}</Text>
        </View>
      </View>

      {/* 레벨 및 경험치 섹션 */}
      <View style={styles.levelSection}>
        <Text style={styles.levelText}>레벨 1</Text>
        <View style={styles.expContainer}>
          <View style={[styles.expBar, { width: '70%' }]} />
        </View>
        <Text style={styles.expText}>경험치: 70% (다음 레벨까지)</Text>
      </View>

      {/* 메뉴 섹션 */}
      <ScrollView>
        <View style={styles.menuSection}>
          {/* 이용안내 섹션 */}
          <Text style={styles.sectionTitle}>이용안내</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('공지사항')} activeOpacity={0.7}>
            <Ionicons name="volume-high" size={22} color="#333" />
            <Text style={styles.menuText}>공지사항</Text>
            {true && <View style={styles.notificationDot} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('자주 하는 질문')} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={22} color="#333" />
            <Text style={styles.menuText}>자주 하는 질문</Text>
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
    backgroundColor: '#fff',
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
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginLeft: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
    borderRadius: 8,
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
  levelSection: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
    marginBottom: 8,
  },
  expContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  expBar: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Roboto',
  },
  menuSection: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Roboto',
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
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Roboto',
  },
});

export default ProfileScreen;