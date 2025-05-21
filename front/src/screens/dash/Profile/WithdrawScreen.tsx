import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
  origin: string;   // ● 원금
  amount: string;   // 환전된 금액
  status: string;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ route }) => {
  const user = route.params.user;
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState<WithdrawItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* 첫 진입 알림 */
  useEffect(() => {
    Alert.alert('알림', '매주 월요일만 출금 신청 가능합니다!', [{ text: '확인' }]);
  }, []);

  /* 출금 내역 로드 */
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

  /* 출금 신청 */
  const handleWithdraw = () => {
    if (!/^\d+$/.test(amount)) return Alert.alert('입력 오류', '숫자만 입력해주세요.');

    const request = parseInt(amount, 10);
    if (request > user.point) return Alert.alert('출금 오류', '출금 한도 초과');

    const feeRate = user.level === 1 ? 0.08 : user.level === 2 ? 0.075 : 0.07;
    const fee = Math.floor(request * feeRate);
    const finalAmount = request - fee;
    const origin = user.originalMoney ?? 0;

    Alert.alert(
      '출금 확인',
      `원금: ₩${origin.toLocaleString()}\n` +
        `포인트: ₩${request.toLocaleString()} → 수수료 ₩${fee.toLocaleString()} 차감\n` +
        `예상 입금: ₩${(origin + finalAmount).toLocaleString()}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            setLoading(true);
            try {
              await dispatch(withdrawAction(request, fee, origin, finalAmount));
              await dispatch(refetchUser());
              const newest = await dispatch(getWithdrawList());
              if (newest?.withdrawals) setHistory(newest.withdrawals);
              setAmount('');
              goBack();
            } catch {
              Alert.alert('오류', '출금 처리 실패');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  /* ────── UI ────── */
  return (
    <SafeAreaView style={styles.root}>
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
        ListEmptyComponent={loading ? <ActivityIndicator style={{ marginTop: 24 }} /> : <Text style={styles.emptyText}>출금 내역이 없습니다.</Text>}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

export default WithdrawScreen;

/* ───────── Styles (동일) ───────── */
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
});
