import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../../../navigation/NavigationUtils';
const PrivacyConsentScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (뒤로 가기 아이콘 포함) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>개인 정보 수집 및 이용 동의</Text>
      </View>

      {/* 개인 정보 수집 및 이용 동의 내용 (스크롤 가능) */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.termsSection}>
          {/* [필수] 개인 정보 수집 및 이용 동의 */}
          <Text style={styles.sectionHeader}>[필수] 개인 정보 수집 및 이용 동의</Text>
          <Text style={styles.termsText}>
            세른(Sern)은 이용자의 권익 및 개인 정보 보호에 만전을 기하고자 관계법령의 규정을 반영하여 세른에 회원가입을 신청하시는 이용자에게 아래와 같이 개인 정보의 수집·이용 목적, 수집하는 개인 정보의 항목, 개인 정보의 보유 및 이용기간을 안내해 드립니다.
          </Text>

          {/* 개인 정보 수집·이용 목적, 항목, 보유 및 이용기간 표 */}
          <Text style={styles.subHeader}>개인 정보 수집·이용 목적, 항목 및 보유 및 이용기간</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>개인 정보 수집·이용 목적</Text>
              <Text style={styles.tableHeader}>수집하는 개인 정보 항목</Text>
              <Text style={styles.tableHeader}>개인 정보 보유 및 이용기간</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>이용자 식별 및 서비스 제공</Text>
              <Text style={styles.tableCell}>
                고객 ID, 출생연도, 휴대전화 번호, 위치정보, 이메일 정보, 실명 이름{'\n'}
                프로필 사진, 사진(메타정보 포함)
              </Text>
              <Text style={styles.tableCell}>회원 탈퇴 시까지(단, 부정 이용 기록은 회원 탈퇴 일로부터 10년, 분쟁 해결 관련 기록은 회원 탈퇴 일로부터 5년)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>유료 서비스 이용 시 콘텐츠 등의 전송이나 배송·요금 정산</Text>
              <Text style={styles.tableCell}>계좌 정보(예금주, 은행명, 계좌번호), 결제에 필요한 정보(유료 서비스 이용 시)</Text>
              <Text style={styles.tableCell}>회원 탈퇴 시까지</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>고객 문의 처리 및 서비스 이용 관련 분쟁 해결</Text>
              <Text style={styles.tableCell}>앱 내 채팅 기능을 사용한 채팅 내용</Text>
              <Text style={styles.tableCell}>회원 탈퇴 시까지(단, 분쟁 해결 관련 기록은 회원 탈퇴 일로부터 5년)</Text>
            </View>
          </View>

          {/* 서비스 이용 과정에서 수집되는 정보 */}
          <Text style={styles.sectionHeader}>서비스 이용 과정에서 수집되는 정보</Text>
          <Text style={styles.termsText}>
            서비스 이용 과정에서 IP 주소, 쿠키, 서비스 이용 기록, 기기 정보, 위치정보가 생성되어 수집될 수 있습니다. 구체적으로 1) 서비스 이용 과정에서 이용자에 관한 정보를 자동화된 방법으로 생성하여 이를 저장(수집) 하거나, 2) 이용자 기기의 고유한 정보를 원래의 값을 확인하지 못하도록 안전하게 변환하여 수집합니다. 서비스 이용 과정에서 위치정보가 수집될 수 있으며, 회사에서 제공하는 위치기반 서비스에 대해서는 '위치정보 수집 및 이용'에서 자세하게 규정하고 있습니다. 이와 같이 수집된 정보는 개인 정보와의 연계 여부 등에 따라 개인 정보에 해당할 수 있고, 개인 정보에 해당하지 않을 수도 있습니다.
          </Text>

          {/* 추가적 개인 정보 활용 */}
          <Text style={styles.sectionHeader}>추가적 개인 정보 활용</Text>
          <Text style={styles.termsText}>
            추가적으로 수집한 개인 정보는 앱 서비스 관련 제반 서비스의 회원관리, 서비스 개발·제공 및 향상, 안전한 인터넷 이용 환경 구축 등 아래의 목적으로만 추가적으로 개인 정보를 이용합니다.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 법령 및 세른의 이용약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재, 계정 도용 및 부정 거래 방지, 약관 개정 등의 고지사항 전달, 분쟁 조정을 위한 기록 보존, 민원처리 등 이용자 보호 및 서비스 운영을 위하여 개인정보를 이용합니다.</Text>
            <Text style={styles.bulletItem}>• 보안, 프라이버시, 안전 측면에서 이용자가 안심하고 이용할 수 있는 서비스 이용 환경 구축을 위해 개인 정보를 이용합니다.</Text>
          </View>

          {/* 개인 정보 보관 및 파기 */}
          <Text style={styles.sectionHeader}>개인 정보 보관 및 파기</Text>
          <Text style={styles.termsText}>
            이용자의 개인 정보를 회원 탈퇴 시 지체 없이 파기하고 있습니다. 단, 이용자에게 개인 정보 보관 기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보 보관 의무를 부과하는 경우 해당 기간 아래와 같이 개인 정보를 안전하게 보관합니다.
          </Text>

          {/* 동의 거부 권리 및 결과 */}
          <Text style={styles.sectionHeader}>동의 거부 권리 및 결과</Text>
          <Text style={styles.termsText}>
            귀하는 위와 같은 필수적인 개인 정보의 수집 및 이용에 대해 동의하지 않을 수 있습니다. 다만, 이에 동의하지 않을 경우 서비스 이용이 어려울 수 있습니다.
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

export default PrivacyConsentScreen;