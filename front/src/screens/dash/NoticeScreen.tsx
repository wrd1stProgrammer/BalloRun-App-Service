import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NoticeScreen: React.FC = () => {
  const navigation = useNavigation();

  // 더미 데이터
  const dummyNotices = [
    {
      id: 1,
      title: '서비스 업데이트 안내',
      date: '2025.03.08',
      content: '안녕하세요, 사용자 여러분! 서비스 안정성을 위한 업데이트가 진행되었습니다.',
    },
    {
      id: 2,
      title: '정기 점검 공지',
      date: '2025.03.05',
      content: '3월 10일 오전 2시부터 4시까지 정기 점검이 예정되어 있습니다.',
    },
    {
      id: 3,
      title: '신규 기능 추가 안내',
      date: '2025.03.01',
      content: '새로운 기능을 추가했습니다! 이제 더 편리하게 이용하실 수 있습니다.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 공지사항 리스트 */}
      <ScrollView style={styles.content}>
        {dummyNotices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDate}>{notice.date}</Text>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 28,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noticeCard: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  noticeDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  noticeContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default NoticeScreen;