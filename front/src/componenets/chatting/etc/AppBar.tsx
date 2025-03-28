// AppBar.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { detailedDescriptions } from './reportDescriptions'; // 문구 파일 가져오기
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { reportChatAction } from '../../../redux/actions/chatAction';
interface AppBarProps {
  onBackPress?: () => void;
  username?: string;
  nickname?: string;
  roomId?: string;
}

const AppBar: React.FC<AppBarProps> = ({ onBackPress, username = '진관', nickname }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'options' | 'details'>('options');

  const dispatch = useAppDispatch();
  // 신고 항목 리스트
  const reportOptions = [
    { id: '2', label: '나체 이미지 또는 성적 행위' },
    { id: '3', label: '혐오 발언 또는 도넛 상징' },
    { id: '4', label: '사기 또는 거짓' },
    { id: '5', label: '폭력 또는 위험한 단체' },
    { id: '6', label: '불법 또는 규제 상품 판매' },
    { id: '7', label: '대물림 또는 괴롭힘' },
    { id: '8', label: '타인 사칭' },
    { id: '9', label: '지식재산권 침해' },
    { id: '10', label: '자살, 자해 또는 섭식 장애' },
    { id: '11', label: '스팸' },
    { id: '12', label: '기타' },
  ];

  // 신고 모달 열기
  const handleReportPress = () => {
    setModalVisible(true);
    setSelectedOption(null);
    setCurrentScreen('options'); // 모달 열 때 options 화면으로 초기화
  };

  // 신고 항목 선택
  const handleReportOptionSelect = (option: { id: string; label: string }) => {
    setSelectedOption(option.label);
    setCurrentScreen('details'); // 세부 화면으로 이동
  };

  // 신고 제출
  const handleConfirm = async() => {
    if (!selectedOption) {
      Alert.alert('오류', '신고 사유를 선택해주세요.');
      return;
    }

    console.log('신고 항목 제출:', {
      username,
      nickname,
      reason: selectedOption,
    });

    await dispatch(reportChatAction(selectedOption,username,roomId));

    Alert.alert('신고 접수', '채팅을 확인하여 검토하겠습니다.', [
      {
        text: '확인',
        onPress: () => {
          setModalVisible(false);
          setCurrentScreen('options'); // 모달 닫고 options로 초기화
        },
      },
    ]);
  };

  // 모달 콘텐츠 렌더링
  const renderModalContent = () => {
    if (currentScreen === 'options') {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>신고</Text>
          <ScrollView style={styles.scrollView}>
            {reportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleReportOptionSelect(option)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#000" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (currentScreen === 'details' && selectedOption) {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('options')}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>신고</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.detailTitle}>{selectedOption} 가이드라인</Text>
            <Text style={styles.detailSubText}>{detailedDescriptions[selectedOption]}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>신고 제출</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{username}</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.icon} onPress={handleReportPress}>
          <Ionicons name="radio-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 신고 모달 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
      >
        {renderModalContent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '80%', // 최소 높이를 80%로 설정
    maxHeight: '80%', // 최대 높이도 80%로 유지
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flexGrow: 1, // ScrollView가 남은 공간을 채우도록 설정
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  detailSubText: {
    fontSize: 14, // 폰트를 살짝 작게 설정
    color: '#666', // 회색으로 설정
    lineHeight: 22,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#0066ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#0066ff',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
    zIndex: 1,
  },
});

export default AppBar;