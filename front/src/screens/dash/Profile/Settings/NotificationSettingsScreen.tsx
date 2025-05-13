import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from '../../../../navigation/NavigationUtils';
import { useAppSelector,useAppDispatch } from '../../../../redux/config/reduxHook';
import { selectUser } from '../../../../redux/reducers/userSlice';
import { updateAlarmState } from '../../../../redux/actions/userAction';

const NotificationSettingsScreen: React.FC = () => {
  const user = useAppSelector(selectUser); 
  const dispatch = useAppDispatch();
  const [chatNotifications, setChatNotifications] = useState<boolean>(user?.allChatAlarm);
  const [adNotifications, setAdNotifications] = useState<boolean>(user?.allAdAlarm);
  const [orderNotifications, setOrderNotifications] = useState<boolean>(user?.allOrderAlarm);

  const handleGoBack = async () => {
    
    goBack();
    await dispatch(updateAlarmState(chatNotifications,adNotifications,orderNotifications))
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 수신 설정</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>채팅</Text>
            <Text style={styles.description}>
              요청, 수락 배달에 대한 자동 생성된 채팅 알림 기능
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#3384FF' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#d3d3d3"
            onValueChange={() => setChatNotifications((prev) => !prev)}
            value={chatNotifications}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>광고</Text>
            <Text style={styles.description}>앱의 광고 푸쉬알림</Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#3384FF' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#d3d3d3"
            onValueChange={() => setAdNotifications((prev) => !prev)}
            value={adNotifications}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>주문 알림</Text>
            <Text style={styles.description}>
              주문 요청, 주문 진행, 완료에 대한 모든 알림
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#3384FF' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#d3d3d3"
            onValueChange={() => setOrderNotifications((prev) => !prev)}
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
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
});

export default NotificationSettingsScreen;
