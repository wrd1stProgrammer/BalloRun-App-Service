import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../../../navigation/NavigationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appAxios } from '../../../redux/config/apiConfig';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';

const NoticeScreen: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation();
  const [notices, setNotices] = useState([]);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await appAxios.get('/notices/readnotices');
      setNotices(res.data.notices);
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
      Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: 항상 중앙정렬 */}
      <View style={styles.header}>
        <View style={styles.side}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.headerTitle}>공지사항</Text>
        </View>
        <View style={styles.side}>
          {user?.admin ? (
            <TouchableOpacity
              onPress={() => navigate('CreateNotice', { user })}
              style={styles.iconButton}
            >
              <Ionicons name="create-outline" size={28} color="#000" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {notices?.map((notice: any) => (
          <TouchableOpacity
            key={notice._id}
            style={styles.noticeCard}
            onPress={() => navigate('NoticeDetail', { notice })}
          >
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDate}>{formatDate(notice.createdAt)}</Text>
            <Text numberOfLines={2} style={styles.noticeContent}>
              {notice.content}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const BUTTON_WIDTH = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  side: {
    width: BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
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
