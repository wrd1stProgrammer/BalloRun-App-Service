import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons 사용
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView 추가
import { useAppSelector,useAppDispatch } from '../../redux/config/reduxHook';
import { selectUser } from '../../redux/reducers/userSlice';
import { Logout } from '../../redux/actions/userAction';

const ProfileScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // 임시 데이터 (아래 공간에 표시할 항목)
  const tempData = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), text: `Item ${i + 1}` }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>마이배달</Text>
        <View style={styles.topBarIcons}>
          <TouchableOpacity onPress={() => console.log('알림 클릭')}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(Logout())} style={styles.settingsIcon}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user?.userImage }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userusername}>{user?.username}</Text>
          <Text style={styles.membership}>포인트 : {user?.point}</Text>
          <Text style={styles.status}>{user?.status}</Text>
        </View>
      </View>

      {/* 스크롤 가능한 리스트 */}
      <FlatList
        data={tempData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginLeft: 16, // 알림 아이콘과 설정 아이콘 사이 간격
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userusername: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  membership: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
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
  },
});

export default ProfileScreen;