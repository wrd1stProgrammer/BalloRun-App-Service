import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../../../navigation/NavigationUtils';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (뒤로 가기 아이콘 포함) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>개인정보처리방침</Text>
      </View>

      {/* 개인정보처리방침 내용 (스크롤 가능) */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.termsSection}>
          {/* 개인정보처리방침 개요 */}
          <Text style={styles.sectionHeader}>개인정보처리방침</Text>
          <Text style={styles.termsText}>
            (주)사우스세른(South Sern (이하 “회사”))은 "정보통신망 이용촉진 및 정보보호에 관한 법률", “개인정보보호법”, "통신비밀보호법", "전기통신사업법" 및 “전자상거래 등에서의 소비자 보호에 관한 법률” 등 정보통신서비스제공자가 준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하겠습니다. 회사는 이용자의 개인정보를 [개인정보의 수집목적]에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 제공 또는 위탁하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 이용자가 사전에 동의한 경우(이용자가 사전에 동의한 경우란, 서비스 이용 등을 위하여 이용자가 자발적으로 자신의 개인정보를 제3자에게 제공하는 것에 동의하는 것을 의미합니다.)</Text>
            <Text style={styles.bulletItem}>• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</Text>
          </View>
          <Text style={styles.termsText}>
            이러한 경우에도, 회사는 이용자에게 (1) 개인정보를 제공받는 자 (2) 개인정보를 제공받는 자(제3자) (3) 그의 이용목적 (4) 개인정보의 보유 및 이용기간을 사전에 고지하고 이에 대해 명시적·개별적으로 동의를 얻습니다. 이와 같은 모든 과정에 있어서 회사는 이용자의 의사에 반하여 추가적인 정보를 수집하거나, 동의의 범위를 벗어난 정보를 제3자와 공유하지 않습니다.
          </Text>

          {/* 개인정보 활용처 */}
          <Text style={styles.sectionHeader}>개인정보 활용처</Text>
          <Text style={styles.termsText}>
            회사는 아래와 같은 활용 목적을 가지고 이용자 개인정보를 수집합니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 서비스의 기본 기능 제공</Text>
            <Text style={styles.bulletItem}>• 개별적 공지 필요시</Text>
            <Text style={styles.bulletItem}>• 서비스 이용과 관련하여 문의나 분쟁의 해결</Text>
            <Text style={styles.bulletItem}>• 유료서비스 이용 시 컨텐츠 등의 전송이나 배송·요금 정산</Text>
            <Text style={styles.bulletItem}>• 맞춤형 서비스 제공</Text>
            <Text style={styles.bulletItem}>• 각종 이벤트나 광고성 정보의 제공</Text>
            <Text style={styles.bulletItem}>• 법령 등에 규정된 의무의 이행</Text>
            <Text style={styles.bulletItem}>• 법령이나 이용약관에 반하여 다수에게 피해를 줄 수 있는 잘못된 이용행위의 방지</Text>
          </View>

          {/* 개인정보를 수집하는 방법 */}
          <Text style={styles.sectionHeader}>개인정보를 수집하는 방법</Text>
          <Text style={styles.termsText}>
            회사는 다음과 같은 방법을 통해 개인정보를 수집합니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우</Text>
            <Text style={styles.bulletItem}>• 거래 과정에서 이용자가 채팅방에 입력하는 휴대번호, 계좌번호</Text>
            <Text style={styles.bulletItem}>• 제휴 서비스 또는 단체 등으로부터 개인정보를 제공받은 경우</Text>
            <Text style={styles.bulletItem}>• 고객센터를 통한 상담 과정에서 웹페이지, 메일, 팩스, 전화 등 온·오프라인에서 진행되는 이벤트/행사 등 참여</Text>
            <Text style={styles.bulletItem}>• 주민등록번호 수집은 소득세법(원천징수영수증 발급)을 위해 수집</Text>
          </View>

          {/* 서비스 이용 과정에서 이용자로부터 수집하는 개인정보 */}
          <Text style={styles.sectionHeader}>서비스 이용 과정에서 이용자로부터 수집하는 개인정보</Text>
          <Text style={styles.termsText}>
            PC웹, 모바일 웹/앱 이용 과정에서 단말기정보(OS, 화면사이즈, 디바이스 아이디), IP주소, 쿠키, 방문일시의 정보가 자동으로 생성되어 수집될 수 있습니다.
          </Text>

          {/* 개인정보의 제3자 제공 및 처리위탁 */}
          <Text style={styles.sectionHeader}>개인정보의 제3자 제공 및 처리위탁</Text>
          <Text style={styles.termsText}>
            회사는 서비스의 향상을 위하여 이용자의 개인정보를 아래의 외부업체에 위탁하여 처리할 수 있습니다.
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>위탁받는자 (수탁자)</Text>
              <Text style={styles.tableHeader}>위탁업무</Text>
              <Text style={styles.tableHeader}>보유 및 이용기간</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>카카오톡 (주)</Text>
              <Text style={styles.tableCell}>개인정보 위탁</Text>
              <Text style={styles.tableCell}>서비스 이용 탈퇴 전까지 보관, 탈퇴시 즉시 폐기</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>?</Text>
              <Text style={styles.tableCell}>?</Text>
              <Text style={styles.tableCell}>?</Text>
            </View>
          </View>

          {/* 개인정보의 국외 이전에 관한 사항 */}
          <Text style={styles.sectionHeader}>개인정보의 국외 이전에 관한 사항</Text>
          <Text style={styles.termsText}>
            회사는 데이터 분석과 데이터 분산 저장을 위해서 이용자의 개인정보를 해외 서비스에 위탁하고 있어요.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 회사명: Amazon Web Services, Inc</Text>
            <Text style={styles.bulletItem}>• 목적: Services를 이용한 데이터 저장</Text>
            <Text style={styles.bulletItem}>• 연락처: </Text>
            <Text style={styles.bulletItem}>• 개인정보 이전 국가: 미국 (Amazon Oregon Region)</Text>
            <Text style={styles.bulletItem}>• 이전되는 항목: 수집하는 모든 개인정보</Text>
            <Text style={styles.bulletItem}>• 이전 일시 및 방법: 데이터 수집 후 수분 이내 Amazon 클라우드 컴퓨팅 환경에 개인정보 보관</Text>
            <Text style={styles.bulletItem}>• 보유 및 이용기간: 회원탈퇴 또는 위탁계약 종료 시</Text>
          </View>

          {/* 개인정보 보유기간, 파기방법 및 이용기간 */}
          <Text style={styles.sectionHeader}>개인정보 보유기간, 파기방법 및 이용기간</Text>
          <Text style={styles.termsText}>
            이용자 개인정보는 이용자로부터 동의를 받은 수집 및 이용목적이 달성된 때에는 회사 내부 방침 또는 관계 법령에서 정한 일정한 기간 동안 보관한 다음 파기합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기하고, 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 회사가 내부 방침 또는 법령에 따라 보관하는 개인정보 및 해당 법령은 아래 표와 같습니다. 분리 보관된 개인정보는 4년간 보관 후 지체없이 파기합니다.
          </Text>
          <Text style={styles.subHeader}>회사 내부 방침에 의한 정보보유 사유</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 보존 항목: 부정 이용 기록</Text>
            <Text style={styles.bulletItem}>• 보존 이유: 부정 이용 방지</Text>
            <Text style={styles.bulletItem}>• 보존 기간: 10년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 채팅 내용 (*서비스 게시물은 개인정보보호를 위해 등록 시점으로부터 14일 뒤 자동 삭제됩니다.)</Text>
            <Text style={styles.bulletItem}>• 보존 이유: 서비스 관련 분쟁 해결</Text>
            <Text style={styles.bulletItem}>• 보존 기간: 5년</Text>
          </View>
          <Text style={styles.subHeader}>관련 법령에 의한 정보보유 사유</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 보존 항목: 계약 또는 청약철회 등에 관한 기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 전자상거래 등에서의 소비자보호에 관한 법률</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 5년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 대금결제 및 재화 등의 공급에 관한 기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 전자상거래 등에서의 소비자보호에 관한 법률</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 5년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 소비자의 불만 또는 분쟁처리에 관한 기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 전자상거래 등에서의 소비자보호에 관한 법률</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 3년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 표시/광고에 관한 기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 전자상거래 등에서의 소비자보호에 관한 법률</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 6개월</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 세법이 규정하는 모든 거래에 관한 장부 및 증빙서류</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 국세기본법</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 5년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 전자금융 거래에 관한 기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 전자금융거래법</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 5년</Text>
            <Text style={styles.bulletItem}>• 보존 항목: 서비스 방문기록</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 근거 법령: 통신비밀보호법</Text>
            <Text style={[styles.bulletItem, styles.nestedText]}>- 보존 기간: 3개월</Text>
          </View>

          {/* 이용자 권리 보호 */}
          <Text style={styles.sectionHeader}>이용자 권리 보호</Text>
          <Text style={styles.termsText}>
            이용자는 언제든지 이용자 개인정보를 조회하거나 수정할 수 있으며 수집·이용에 대한 동의 철회 또는 가입 해지를 요청할 수도 있습니다. 보다 구체적으로는 서비스 내 설정 기능을 통한 변경, 가입 해지(동의 철회)를 위해서는 서비스 내 "계정탈퇴"를 클릭하면 되며, 운영자에게 이메일이나 별도 게시판으로 문의할 경우도 지체 없이 조치하겠습니다.
          </Text>

          {/* 개인정보 문의처 */}
          <Text style={styles.sectionHeader}>개인정보 문의처</Text>
          <Text style={styles.termsText}>
            사용자가 서비스를 이용하면서 발생하는 모든 개인정보보호 관련 문의, 불만, 조언이나 기타 사항은 개인정보 보호책임자 및 담당부서로 연락해 주시기 바랍니다. 회사는 사용자 목소리에 귀 기울이고 신속하고 충분한 답변을 드릴 수 있도록 최선을 다하겠습니다.
          </Text>
          <Text style={styles.subHeader}>개인정보보호 책임자</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 이름: </Text>
            <Text style={styles.bulletItem}>• 직위: 대표</Text>
            <Text style={styles.bulletItem}>• 연락처: </Text>
          </View>

          {/* 고지의 의무 */}
          <Text style={styles.sectionHeader}>고지의 의무</Text>
          <Text style={styles.termsText}>
            회사는 법률이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보처리방침을 수정할 수 있습니다. 개인정보처리방침이 변경되는 경우 회사는 변경 사항을 게시하며, 변경된 개인정보처리방침은 게시한 날로부터 7일 후부터 효력이 발생합니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    marginRight: 10, // 타이틀과의 간격
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#333',
    flex: 1, // 타이틀이 중앙에 오도록
    textAlign: 'center', // 타이틀 중앙 정렬
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  termsSection: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
    marginBottom: 10,
    marginTop: 15,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Roboto',
    marginBottom: 8,
    marginTop: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
    lineHeight: 20, // 텍스트 간격 조정
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  nestedText: {
    marginLeft: 15, // 중첩 텍스트의 들여쓰기
  },
  bulletItem: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
    lineHeight: 20,
    marginBottom: 5,
  },
  table: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
    flex: 1,
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;