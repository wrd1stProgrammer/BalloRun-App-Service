import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from '../../../../navigation/NavigationUtils';

const NotificationSettingsScreen: React.FC = () => {
  // 각 알림 종류에 대한 상태 관리
  const [chatNotifications, setChatNotifications] = useState<boolean>(false);
  const [adNotifications, setAdNotifications] = useState<boolean>(false);
  const [orderNotifications, setOrderNotifications] = useState<boolean>(false);

  // 더미 함수: 채팅 알림
  const onChatNotificationsEnabled = () => {
    console.log('채팅 알림이 활성화되었습니다.');
    // 백엔드 API 호출 예시: 
    // fetch('/api/notifications/chat/enable', { method: 'POST' });
  };

  const onChatNotificationsDisabled = () => {
    console.log('채팅 알림이 비활성화되었습니다.');
    // 백엔드 API 호출 예시:
    // fetch('/api/notifications/chat/disable', { method: 'POST' });
  };

  // 더미 함수: 광고 알림
  const onAdNotificationsEnabled = () => {
    console.log('광고 알림이 활성화되었습니다.');
    // 백엔드 API 호출 예시:
    // fetch('/api/notifications/ad/enable', { method: 'POST' });
  };

  const onAdNotificationsDisabled = () => {
    console.log('광고 알림이 비활성화되었습니다.');
    // 백엔드 API 호출 예시:
    // fetch('/api/notifications/ad/disable', { method: 'POST' });
  };

  // 더미 함수: 주문 알림
  const onOrderNotificationsEnabled = () => {
    console.log('주문 알림이 활성화되었습니다.');
    // 백엔드 API 호출 예시:
    // fetch('/api/notifications/order/enable', { method: 'POST' });
  };

  const onOrderNotificationsDisabled = () => {
    console.log('주문 알림이 비활성화되었습니다.');
    // 백엔드 API 호출 예시:
    // fetch('/api/notifications/order/disable', { method: 'POST' });
  };

  // 토글 스위치 핸들러
  const toggleChatNotifications = () => {
    setChatNotifications((prev) => {
      const newState = !prev;
      if (newState) {
        onChatNotificationsEnabled(); // "on" 상태일 때 호출
      } else {
        onChatNotificationsDisabled(); // "off" 상태일 때 호출
      }
      return newState;
    });
  };

  const toggleAdNotifications = () => {
    setAdNotifications((prev) => {
      const newState = !prev;
      if (newState) {
        onAdNotificationsEnabled();
      } else {
        onAdNotificationsDisabled();
      }
      return newState;
    });
  };

  const toggleOrderNotifications = () => {
    setOrderNotifications((prev) => {
      const newState = !prev;
      if (newState) {
        onOrderNotificationsEnabled();
      } else {
        onOrderNotificationsDisabled();
      }
      return newState;
    });
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 수신 설정</Text>
      </View>

      {/* 알림 설정 목록 */}
      <View style={styles.content}>
        {/* 채팅 알림 */}
        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>채팅</Text>
            <Text style={styles.description}>
              요청, 수락 배달에 대한 자동 생성된 채팅 알림 기능
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#0064FF' }} // off: 회색, on: 오렌지색
            thumbColor={chatNotifications ? '#ffffff' : '#ffffff'} // 흰색 원
            ios_backgroundColor="#d3d3d3" // iOS에서 off 상태일 때 회색
            onValueChange={toggleChatNotifications}
            value={chatNotifications}
          />
        </View>

        {/* 광고 알림 */}
        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>광고</Text>
            <Text style={styles.description}>앱의 광고 푸쉬알림</Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#0064FF' }}
            thumbColor={adNotifications ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            onValueChange={toggleAdNotifications}
            value={adNotifications}
          />
        </View>

        {/* 주문 알림 */}
        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>주문 알림</Text>
            <Text style={styles.description}>
              주문 요청, 주문 진행, 완료에 대한 모든 알림
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#0064FF' }}
            thumbColor={orderNotifications ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            onValueChange={toggleOrderNotifications}
            value={orderNotifications}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // 항목 간 간격
  },
  textContainer: {
    flex: 1, // 텍스트 영역이 가능한 많은 공간을 차지하도록
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888', // 회색 글씨
  },
});

export default NotificationSettingsScreen;