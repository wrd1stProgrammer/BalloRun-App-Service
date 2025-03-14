import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Header from '../../../utils/OrderComponents/Header';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';
import { appAxios } from '../../../redux/config/apiConfig';
import { navigate } from '../../../navigation/NavigationUtils';

const AddressDetailScreen = ({ route }: any) => {
  const { selectedAddress,lat,lng } = route.params;
  
  const [detail, setDetail] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [riderNote, setRiderNote] = useState('');
  const [entranceCode, setEntranceCode] = useState('');
  const [directions, setDirections] = useState('');

  const user = useAppSelector(selectUser); // Get logged-in user info

  const handleRegisterAddress = async () => {
    if (!detail || !selectedType) {
      Alert.alert('입력 오류', '주소 상세 정보와 유형을 선택해주세요.');
      return;
    }

    const addressData = {
      userId: user?._id,
      address: selectedAddress,
      detail,
      postalCode: '', // 필요하면 추가
      addressType: selectedType,
      riderNote,
      entranceCode,
      directions,
      lat: lat, // 추가된 lat
      lng: lng   // 추가된 lng
    };

    try {
      const response = await appAxios.post('/address/add', addressData);
      const result = await response.data;
      if (response.status === 201) {
        Alert.alert('성공', '주소가 등록되었습니다.');
      } else {
        Alert.alert('오류', result.message);
      }

      navigate("HomeScreen");
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('네트워크 오류', '주소를 등록할 수 없습니다.');
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="주소 상세" />
      
      <View style={styles.container}>
        <Text style={styles.addressTitle}>{selectedAddress}</Text>
        
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

        <Text style={styles.note}>
          * 입력된 공동현관 비밀번호는 원활한 배달을 위해 필요한 정보로, 배달을 진행하는 라이더님과 사장님께 전달됩니다.
        </Text>

        <Pressable style={styles.registerButton} onPress={handleRegisterAddress}> 
          <Text style={styles.registerButtonText}>주소 등록</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  note: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
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
});

export default AddressDetailScreen;