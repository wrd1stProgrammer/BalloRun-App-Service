import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector, useAppDispatch } from '../../../../redux/config/reduxHook';
import { selectUser } from '../../../../redux/reducers/userSlice';
import { goBack } from '../../../../navigation/NavigationUtils';
import { updateUserProfileAction } from '../../../../redux/actions/userAction';

type EditableFields = {
  nickname?: string;
  phone?: string;
  email?: string;
  address?: string;
  riderNote?: string;
};

const AccountManagementScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [changes, setChanges] = useState<EditableFields>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setHasChanges(Object.keys(changes).length > 0);
  }, [changes]);

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditedValue(currentValue);
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const finishEditing = () => {
    if (editingField && editedValue !== getOriginalValue(editingField)) {
      setChanges((prev) => ({
        ...prev,
        [editingField]: editedValue,
      }));
    }
    setEditingField(null);
  };

  const getOriginalValue = (field: string): string => {
    switch (field) {
      case 'nickname':
        return user?.nickname || '';
      case 'phone':
        return user?.phone || '';
      case 'email':
        return user?.email || '';
      case 'address':
        return `${user?.address || ''} ${user?.detail || ''}`.trim();
      case 'riderNote':
        return user?.riderNote || '';
      default:
        return '';
    }
  };

  const getDisplayValue = (field: string): string => {
    return changes[field as keyof EditableFields] || getOriginalValue(field);
  };

  const saveChanges = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      // address 필드 분리
      const payload = { ...changes };
      if (payload.address) {
        const [address, ...detailParts] = payload.address.split(' ');
        payload.address = address;
        payload.detail = detailParts.join(' ') || '';
      }

      // API 호출
      await dispatch(updateUserProfileAction(payload));
      setChanges({});
      setHasChanges(false);
      alert('변경 사항이 저장되었습니다.');
    } catch (error) {
      // 에러는 updateUserProfileAction에서 Alert로 처리됨
      // <Icon name="pencil-outline" size={18} color="#888" />

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계정 관리</Text>
        {hasChanges ? (
          <TouchableOpacity
            onPress={saveChanges}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FF6B00" />
            ) : (
              <Text style={styles.saveButtonText}>완료</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.saveButtonPlaceholder} />
        )}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 정보</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>닉네임</Text>
            {editingField === 'nickname' ? (
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                onSubmitEditing={finishEditing}
                autoCapitalize="none"
                returnKeyType="done"
              />
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.infoValue}>{getDisplayValue('nickname')}</Text>
                <TouchableOpacity
                  onPress={() => startEditing('nickname', getOriginalValue('nickname'))}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>아이디</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValue}>{user?.userId}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>전화번호</Text>
            {editingField === 'phone' ? (
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                onSubmitEditing={finishEditing}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.infoValue}>{getDisplayValue('phone')}</Text>
                <TouchableOpacity
                  onPress={() => startEditing('phone', getOriginalValue('phone'))}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이메일</Text>
            {editingField === 'email' ? (
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                onSubmitEditing={finishEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
              />
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.infoValue}>{getDisplayValue('email')}</Text>
                <TouchableOpacity
                  onPress={() => startEditing('email', getOriginalValue('email'))}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>계정 상태</Text>
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationText}>
                {user?.verificationStatus === 'verified' ? '인증 완료' : '인증 필요'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배송 정보</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>주소</Text>
            {editingField === 'address' ? (
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                onSubmitEditing={finishEditing}
                returnKeyType="done"
              />
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.infoValue}>
                  {getDisplayValue('address')}
                  {user?.addressType === 'home' && ' (집)'}
                  {user?.addressType === 'work' && ' (회사)'}
                </Text>
                <TouchableOpacity
                  onPress={() => startEditing('address', getOriginalValue('address'))}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>배송 메모</Text>
            {editingField === 'riderNote' ? (
              <TextInput
                ref={textInputRef}
                style={[styles.input, { textAlign: 'left' }]}
                value={editedValue}
                onChangeText={setEditedValue}
                onSubmitEditing={finishEditing}
                returnKeyType="done"
                multiline
              />
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.infoValue}>
                  {getDisplayValue('riderNote') || '배송 메모가 없습니다.'}
                </Text>
                <TouchableOpacity
                  onPress={() => startEditing('riderNote', getOriginalValue('riderNote'))}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {user?.isRider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>라이더 정보</Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>라이더 상태</Text>
              <Text style={styles.infoValue}>
                {user?.isDelivering ? '배달 중' : '대기 중'}
              </Text>
            </View>

            <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>진행 중인 주문</Text>
              <Text style={styles.infoValue}>
                {user?.isOngoingOrder ? '있음' : '없음'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  saveButtonPlaceholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '60%',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },
  input: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    paddingVertical: 4,
    flex: 1,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B00',
  },
  verificationBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verificationText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AccountManagementScreen;