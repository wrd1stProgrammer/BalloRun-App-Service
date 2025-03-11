import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { appAxios } from '../../../redux/config/apiConfig';
import { navigate,goBack } from '../../../navigation/NavigationUtils';

const CreateNoticeScreen: React.FC<{ route: any }> = ({ route }) => {
  const user = route.params?.user;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await appAxios.post('/notices/writenotices', { title, content });
      goBack();
    } catch (error) {
      console.error('공지사항 작성 실패:', error);
      Alert.alert('오류', '공지사항 작성에 실패했습니다.');
    }
  };

  if (!user?.admin) {
    goBack();
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항 작성</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="내용"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>
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
  saveButton: {
    padding: 5,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    padding: 10,
    flex: 1,
    textAlignVertical: 'top',
  },
});

export default CreateNoticeScreen;