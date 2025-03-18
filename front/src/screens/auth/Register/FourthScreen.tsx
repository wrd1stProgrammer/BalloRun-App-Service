import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { goBack, resetAndNavigate } from '../../../navigation/NavigationUtils';

const FourthScreen = () => {
  const [allAgreed, setAllAgreed] = useState(false);
  const [terms, setTerms] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    terms5: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');

  // 전체 동의 토글
  const toggleAll = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTerms({
      terms1: newValue,
      terms2: newValue,
      terms3: newValue,
      terms4: newValue,
      terms5: newValue,
    });
  };

  // 개별 약관 토글
  const toggleTerm = (key) => {
    const newTerms = { ...terms, [key]: !terms[key] };
    setTerms(newTerms);
    setAllAgreed(Object.values(newTerms).every((term) => term));
  };

  // 약관 모달 열기
  const openModal = (term) => {
    setSelectedTerm(term);
    setModalVisible(true);
  };

  // 다음 버튼 핸들러
  const handleNext = () => {
    if (allAgreed) {
      resetAndNavigate('LoginScreen');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color="#202632" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>고객센터</Text>
      </View>

      {/* 약관 동의 섹션 */}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>약관 동의</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={toggleAll}>
              <Ionicons
                name={allAgreed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={allAgreed ? '#0064FF' : '#202632'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>필수 약관 모두 체결하기</Text>
          </View>
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={() => toggleTerm('terms1')}>
              <Ionicons
                name={terms.terms1 ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={terms.terms1 ? '#0064FF' : '#202632'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>선택 약관 모두 체결하기</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>필수 약관</Text>
          {[
            '[필수]토스팀과 동정 상생협력서',
            '[필수]토스팀과 동정 토약',
            '[필수]심부름하자유로운동정약관',
            '[필수]체결하기자유로운약관',
            '[필수]동정 약관 및 대매허정약관체결 등...',
          ].map((term, index) => (
            <View key={index} style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => toggleTerm(`terms${index + 1}`)}>
                <Ionicons
                  name={terms[`terms${index + 1}`] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={terms[`terms${index + 1}`] ? '#0064FF' : '#202632'}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>{term}</Text>
              <TouchableOpacity onPress={() => openModal(term)} style={styles.arrow}>
                <Ionicons name="chevron-forward" size={20} color="#202632" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 다음 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !allAgreed && styles.disabledButton]}
          onPress={handleNext}
          disabled={!allAgreed}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>

      {/* 약관 모달 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="chevron-back" size={24} color="#202632" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTerm}</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            {/* 약관 내용은 비워둠 */}
            <Text style={styles.modalText}>약관 내용이 여기에 표시됩니다.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#202632',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 100, // 버튼 공간 확보
  },
  section: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202632',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#202632',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202632',
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#202632',
    marginLeft: 10,
  },
  arrow: {
    padding: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nextButton: {
    backgroundColor: '#0064FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#202632',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#202632',
  },
});

export default FourthScreen;