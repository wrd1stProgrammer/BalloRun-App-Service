import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Header from '../../../utils/OrderComponents/Header';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';
import { appAxios } from '../../../redux/config/apiConfig';
import { navigate } from '../../../navigation/NavigationUtils';

const AddressEditDetailScreen = ({ route }: any) => {
  const { addressId, address, detail: existingDetail } = route.params;
  
  const [detail, setDetail] = useState(existingDetail || '');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [riderNote, setRiderNote] = useState('');
  const [entranceCode, setEntranceCode] = useState('');
  const [directions, setDirections] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAppSelector(selectUser); // 현재 로그인된 사용자 정보 가져오기

  const handleUpdateAddress = async () => {
    if (!detail || !selectedType) {
      Alert.alert('입력 오류', '주소 상세 정보와 유형을 선택해주세요.');
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    const addressData = {
      userId: user?._id,
      address,
      detail,
      postalCode: '',
      addressType: selectedType,
      riderNote,
      entranceCode,
      directions,
    };

    try {
      const response = await appAxios.put(`/address/${addressId}`, addressData);
      if (response.status === 200) {
        Alert.alert('성공', '주소가 업데이트되었습니다.');
      } else {
        Alert.alert('오류', '주소 업데이트에 실패했습니다.');
      }
      navigate("AddressSettingScreen"); // 업데이트 후 편집 목록 화면으로 이동
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      Alert.alert('네트워크 오류', '주소를 업데이트할 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="주소 편집" />
      
      <View style={styles.container}>
        <Text style={styles.addressTitle}>{address}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="건물명, 동/호수 등 상세주소 입력"
          value={detail}
          onChangeText={setDetail}
        />

        <View style={styles.quickSelectContainer}>
          <Pressable 
            style={[styles.quickButton, selectedType === 'home' && styles.selectedButton]} 
            onPress={() => setSelectedType('home')}>
            <Text style={[selectedType === 'home' && styles.selectedText]}>🏠 우리집</Text>
          </Pressable>
          <Pressable 
            style={[styles.quickButton, selectedType === 'work' && styles.selectedButton]} 
            onPress={() => setSelectedType('work')}>
            <Text style={[selectedType === 'work' && styles.selectedText]}>🏢 회사</Text>
          </Pressable>
          <Pressable 
            style={[styles.quickButton, selectedType === 'other' && styles.selectedButton]} 
            onPress={() => setSelectedType('other')}>
            <Text style={[selectedType === 'other' && styles.selectedText]}>📍 기타</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>라이더님께</Text>
        <TextInput
          style={styles.input}
          placeholder="문 앞에 두고 벨 눌러주세요"
          value={riderNote}
          onChangeText={setRiderNote}
        />

        <Text style={styles.sectionTitle}>공동현관 비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="예) #1234"
          value={entranceCode}
          onChangeText={setEntranceCode}
        />

        <Text style={styles.sectionTitle}>찾아오는 길 안내</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 편의점 옆 건물이에요"
          value={directions}
          onChangeText={setDirections}
        />

        <Pressable style={[styles.registerButton, { opacity: isSubmitting ? 0.6 : 1 }]} onPress={handleUpdateAddress} disabled={isSubmitting}> 
          <Text style={styles.registerButtonText}>주소 저장</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f9f9f9',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'nowrap', // 버튼이 한 줄에 유지되도록 설정
    marginTop: 8,
    width: 120, // 버튼 컨테이너 크기 지정
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginRight: 8,
    minWidth: 60, // Ensures button is large enough
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 60, // Ensures button is large enough
    alignItems: 'center',
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexWrap: 'wrap', // Ensures layout adapts to small screens
  },
});

export default AddressEditDetailScreen;