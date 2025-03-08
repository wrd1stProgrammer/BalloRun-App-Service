import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../../utils/OrderComponents/Header';

const AddressDetailScreen = ({ route }: any) => {
  const { selectedAddress } = route.params;
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="주소 상세" />
      
      <View style={styles.container}>
        <Text style={styles.addressTitle}>{selectedAddress}</Text>
        <Text style={styles.addressSubText}>{selectedAddress}</Text>
        
        <TextInput style={styles.input} placeholder="건물명, 동/호수 등 상세주소 입력" />

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
        <TextInput style={styles.input} placeholder="문 앞에 두고 벨 눌러주세요" />
        
        <Text style={styles.sectionTitle}>공동현관 비밀번호</Text>
        <TextInput style={styles.input} placeholder="예) #1234" />
        
        <Text style={styles.sectionTitle}>찾아오는 길 안내</Text>
        <TextInput style={styles.input} placeholder="예) 편의점 옆 건물이에요" />
        
        <Text style={styles.note}>* 입력된 공동현관 비밀번호는 원활한 배달을 위해 필요한 정보로, 배달을 진행하는 라이더님과 사장님께 전달됩니다.</Text>
        
        <Pressable style={styles.registerButton} onPress={() => alert('주소 등록 완료')}> 
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
  addressSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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
    backgroundColor: '#ddd',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 'bold',
  },
});

export default AddressDetailScreen;
