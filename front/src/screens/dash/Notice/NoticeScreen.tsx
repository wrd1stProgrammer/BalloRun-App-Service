import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigate,goBack } from '../../../navigation/NavigationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appAxios } from '../../../redux/config/apiConfig';
import { Alert } from 'react-native';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';


const NoticeScreen: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation();
  const [notices, setNotices] = useState([]);
  const user =  useAppSelector(selectUser);


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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
        {user?.admin && (
          <TouchableOpacity
            onPress={() => navigate('CreateNotice', { user })}
            style={styles.writeButton}
          >
            <Ionicons name="create-outline" size={28} color="#000" />
          </TouchableOpacity>
        )}
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
  writeButton: {
    padding: 5,
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