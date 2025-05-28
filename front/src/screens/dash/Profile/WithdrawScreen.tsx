import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { refetchUser, withdrawAction, getWithdrawList } from '../../../redux/actions/userAction';

/* ────── Types ────── */
interface User {
  account?: { bankName: string; accountNumber: string; holder: string };
  point: number;
  originalMoney: number;
  level: number;
}
interface WithdrawScreenProps {
  route: { params: { user: User } };
}
interface WithdrawItem {
  id: string;
  date: string;
  origin: string;
  amount: string;
  status: string;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ route }) => {
  const user = route.params.user;
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState<WithdrawItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState<{
    request: number;
    fromOrigin: number;
    fromPoint: number;
    fee: number;
    finalAmount: number;
  } | null>(null);

  useEffect(() => {
    // 안내 알림 (원하면 삭제)
    // Alert.alert('알림', '매주 월요일만 출금 신청 가능합니다!', [{ text: '확인' }]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await dispatch(getWithdrawList());
        if (res?.withdrawals) setHistory(res.withdrawals);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  /* 출금 신청 (원금 우선 차감) */
  const handleWithdraw = () => {
    if (!/^\d+$/.test(amount)) {
      setConfirmInfo(null);
      setConfirmVisible(false);
      return;
    }
    const request = parseInt(amount, 10);
    if (request > user.originalMoney + user.point) {
      setConfirmInfo(null);
      setConfirmVisible(false);
      return;
    }

    let fromOrigin = 0;
    let fromPoint = 0;
    let fee = 0;
    let finalAmount = 0;

    // 원금 우선 차감
    if (user.originalMoney >= request) {
      fromOrigin = request;
      fromPoint = 0;
      fee = 0;
      finalAmount = fromOrigin;
    } else {
      fromOrigin = user.originalMoney;
      fromPoint = request - user.originalMoney;
      const feeRate = user.level === 1 ? 0.08 : user.level === 2 ? 0.075 : 0.07;
      fee = Math.floor(fromPoint * feeRate);
      finalAmount = fromOrigin + (fromPoint - fee);
    }
    setConfirmInfo({ request, fromOrigin, fromPoint, fee, finalAmount });
    setConfirmVisible(true);
  };

  const confirmWithdraw = async () => {
    if (!confirmInfo) return;
    setLoading(true);
    setConfirmVisible(false);
    try {
      await dispatch(
        withdrawAction(
          confirmInfo.request,
          confirmInfo.fromOrigin,
          confirmInfo.fromPoint,
          confirmInfo.fee,
          confirmInfo.finalAmount
        )
      );
      await dispatch(refetchUser());
      const newest = await dispatch(getWithdrawList());
      if (newest?.withdrawals) setHistory(newest.withdrawals);
      setAmount('');
      goBack();
    } catch {
      // 실패시 알림
      // Alert.alert('오류', '출금 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* 출금 확인 모달 */}
      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable style={styles.modalBg} onPress={() => setConfirmVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>출금 확인</Text>
            {confirmInfo && (
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.modalRow}>
                  <Text style={styles.modalLabel}>출금 금액: </Text>
                  ₩{confirmInfo.request.toLocaleString()}
                </Text>
                <Text style={styles.modalRow}>
                  <Text style={styles.modalLabel}>원금에서: </Text>
                  ₩{confirmInfo.fromOrigin.toLocaleString()}
                </Text>
                <Text style={styles.modalRow}>
                  <Text style={styles.modalLabel}>포인트에서: </Text>
                  ₩{confirmInfo.fromPoint.toLocaleString()}
                </Text>
                {confirmInfo.fee > 0 && (
                  <Text style={styles.modalRow}>
                    <Text style={styles.modalLabel}>수수료(포인트): </Text>
                    ₩{confirmInfo.fee.toLocaleString()}
                  </Text>
                )}
                <Text style={[styles.modalRow, { fontWeight: 'bold', color: '#3384FF', fontSize: 16 }]}>
                  <Text style={styles.modalLabel}>예상 입금: </Text>
                  ₩{confirmInfo.finalAmount.toLocaleString()}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.modalBtnCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={confirmWithdraw}>
                <Text style={styles.modalBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>출금</Text>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* 계좌 정보 카드 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>계좌 정보</Text>
              {[
                ['은행명', user.account?.bankName ?? '정보 없음'],
                ['계좌번호', user.account?.accountNumber ?? '정보 없음'],
                ['예금주', user.account?.holder ?? '정보 없음'],
              ].map(([l, v]) => (
                <View style={styles.row} key={l}>
                  <Text style={styles.label}>{l}</Text>
                  <Text style={styles.value}>{v}</Text>
                </View>
              ))}
            </View>

            {/* 출금 입력 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>출금 요청</Text>
              <Text style={styles.balance}>
                원금&nbsp;
                <Text style={styles.highlight}>
                  ₩{user.originalMoney.toLocaleString()}
                </Text>
                &nbsp;/&nbsp;포인트&nbsp;
                <Text style={styles.highlight}>
                  ₩{user.point.toLocaleString()}
                </Text>
              </Text>

              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={amount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
              />

              <TouchableOpacity
                style={[styles.button, (!amount || loading) && styles.buttonDisabled]}
                disabled={!amount || loading}
                onPress={handleWithdraw}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>출금하기</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.historyHeading}>출금 내역</Text>
          </>
        }
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View style={styles.row}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyStatus}>{item.status}</Text>
            </View>
            <Text style={styles.historyAmount}>{item.origin}</Text>
            <Text style={styles.historyAmount}>{item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : (
            <Text style={styles.emptyText}>출금 내역이 없습니다.</Text>
          )
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

export default WithdrawScreen;

/* ───────── Styles ───────── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 12, color: '#1A1A1A' },
  card: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginVertical: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 14, color: '#6B7280' },
  value: { fontSize: 14, fontWeight: '500', color: '#111' },
  balance: { fontSize: 14, marginBottom: 8, color: '#6B7280' },
  highlight: { color: '#3384FF', fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: { backgroundColor: '#3384FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A7C7FF' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  historyHeading: { marginTop: 16, marginBottom: 4, fontSize: 16, fontWeight: '600', color: '#333' },
  historyCard: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, marginVertical: 4 },
  historyDate: { fontSize: 13, color: '#6B7280' },
  historyStatus: { fontSize: 13, color: '#3384FF' },
  historyAmount: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 32, color: '#6B7280' },
  // 모달 스타일 추가
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 300, backgroundColor: '#fff', borderRadius: 14, padding: 22, elevation: 4 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 16, textAlign: 'center' },
  modalRow: { fontSize: 15, marginBottom: 4, color: '#222' },
  modalLabel: { color: '#888' },
  modalBtn: { flex: 1, backgroundColor: '#3384FF', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalBtnCancel: { flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  modalBtnCancelText: { color: '#222', fontWeight: 'bold', fontSize: 15 },
});

