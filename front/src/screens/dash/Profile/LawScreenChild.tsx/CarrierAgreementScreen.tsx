import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../../../navigation/NavigationUtils';
const CarrierAgreementScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 (뒤로 가기 아이콘 포함) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>캐리어 업무위수탁약관</Text>
      </View>

      {/* 캐리어 업무위수탁약관 내용 (스크롤 가능) */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.termsSection}>
          {/* 제1조 (목적) */}
          <Text style={styles.sectionHeader}>제1조 (목적)</Text>
          <Text style={styles.termsText}>
            본 약관은 ㈜사우스세른(South Sern, 이하 “회사”)이 “발로뛰어” 서비스 이용약관 제2조에 정의된 캐리어(이하 “수탁인”)에게 본 약관 제3조 기재 업무를 위탁함에 있어서 회사와 수탁인의 권리와 의무에 관한 사항을 정함을 그 목적으로 합니다.
          </Text>

          {/* 제2조 (수탁인의 지위) */}
          <Text style={styles.sectionHeader}>제2조 (수탁인의 지위)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 수탁인은 회사에 종속되지 아니하고 독립적으로 위탁업무를 수행하는 거래주체입니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인에 대하여서는 회사의 취업규칙 등 사규 일체가 적용되지 아니합니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무의 수행과 관련하여 회사로부터 구체적·개별적 지휘·감독을 받지 아니합니다.</Text>
          </View>

          {/* 제3조 (위탁업무) */}
          <Text style={styles.sectionHeader}>제3조 (위탁업무)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 회사가 수탁인에게 위탁하는 업무(이하 “위탁업무”)는 다음 각호와 같습니다.</Text>
          </View>
          <View style={[styles.bulletList, { marginLeft: 30 }]}>
            <Text style={styles.bulletItem}>1. “앱이름적어” (이하 “서비스”) 고객이 요청하는 업무(이하 “서비스”)의 수행</Text>
            <Text style={styles.bulletItem}>2. 제1호 업무에 직접 또는 간접적으로 부수하는 업무</Text>
          </View>
          <Text style={styles.termsText}>
            수탁인은 위탁업무의 구체적인 내용 및 수행 방안 등을 스스로 정하여야 합니다. 수탁인은 위탁업무의 수행에 소요되는 비용을 스스로 마련하여야 합니다. 수탁인은 자유로운 의사에 따라 위탁업무 수행 여부를 결정할 수 있습니다. 다만, 수행하기로 결정한 업무의 경우, 업무 수행 중 수탁인의 요청으로 위탁업무를 취소할 경우 회사 서비스 이용약관 제11조 제3항에 따라 수탁인의 위탁업무 수행활동이 3일간 정지됩니다. 수탁인은 위탁 업무 수행 시 고객의 연락 불이행 문제로 업무를 수행할 수 없을 경우, 최소 30분간 수탁 업무를 중지하지 않아야 할 의무가 있습니다. 수탁인은 해당 상황이 발생할 경우 회사에 알려야 하며, 회사는 수탁인과 고객의 연락을 중개하도록 노력하겠습니다. 회사는 수탁인과 고객 간 매칭을 도와드리는 중개 플랫폼으로서, 인터넷 상의 공간만 제공할 뿐, 기본적으로 당사자 간의 거래 여부 및 거래 내용에 일절 관여하지 않습니다. 개별 거래에서 저작권, 소유권, 사용권 등 법적 권리에 대해서는 이용자들이 개별적으로 정할 수 있고, 이에 관하여 회사는 어떠한 책임도 부담하지 않습니다. 또한 개별 이용자들 간 연락, 방문 과정에서 일어나는 폭행, 상해, 성범죄, 사기 등 민, 형사상 책임에 대해서 개별 이용자들이 전적으로 책임을 부담하며, 회사는 책임을 부담하지 않습니다. 만일 이로 인해 회사가 피해 이용자로부터 민, 형사 소송 등 기타 책임을 추궁당하는 경우, 가해 이용자가 회사를 적극적으로 면책시켜야 하며, 만일 회사가 피해를 입는 경우, 가해 이용자에게 민, 형사 법적 책임을 물을 수 있습니다.
          </Text>

          {/* 제4조 (약관 적용 기간) */}
          <Text style={styles.sectionHeader}>제4조 (약관 적용 기간)</Text>
          <Text style={styles.termsText}>
            본 약관의 적용기간은 본 약관에 동의한 날로부터 수탁인이 서비스 계정을 탈퇴할 때까지로 합니다.
          </Text>

          {/* 제5조 (수익금의 지급 또는 환불) */}
          <Text style={styles.sectionHeader}>제5조 (수익금의 지급 또는 환불)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 회사는 수탁인의 위탁업무 수행에 대한 대가로 위탁보수(이하 ‘수익금’)를 지급하며, 이 때의 수익금은 ‘앱이름’ 서비스 요청 고객이 정한 금액으로 합니다.</Text>
            <Text style={styles.bulletItem}>• 회사는 수탁인의 인출신청에 따라 수탁인이 지정한 계좌로 수익금을 지급합니다. 수탁인은 위 지급일로부터 2일 전까지 인출 신청을 하여야 합니다. 또한, 근로 기준법 제43조 ‘임금은 직접 근로자에게 그 전액을 지급하여야 한다’에 의거하여 본인 명의가 아닌 가족 혹은 타 명의 계좌를 등록하셨다면 수익금 지급이 자동 보류됩니다. 적립 수익금의 금액과 관계없이 회사를 통하지 않고 직거래로 위탁업무 진행 및 수익금을 지급받을 경우, 이를 위해 개인 연락처를 공유할 경우, 활동이 영구 정지되며, 고객과 발생하는 모든 분쟁에 대해 회사가 중재 및 책임지지 않습니다.</Text>
            <Text style={styles.bulletItem}>• 회사는 적립 수익금에서 서비스 수수료 8%를 차감하고 원천징수 3.3% 공제한 후 수탁인이 지정한 계좌로 수익금을 지급합니다. 회사는 서비스 이용에 대한 대가로서 수수료를 징수할 뿐, 고객과 수탁인 사이의 개별 거래에 관여하는 것은 아니며, 수익금 지급 업무를 처리한다고 하여도, 개별 거래에 대한 고객과 수탁인의 법적 책임을 대신 부담하지 않습니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 특수고용직으로 근로기준법상 회사는 수탁인에게 수익금 지급 명세서 교부 의무가 없습니다.</Text>
          </View>

          {/* 제6조 (배달 수익금 ‘산재보험’ 및 ‘고용보험’ 공제) */}
          <Text style={styles.sectionHeader}>제6조 (배달 수익금 ‘산재보험’ 및 ‘고용보험’ 공제)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 산재보험: ‘산업재해보상보험법’ 하위법령의 개정에 따라 배달 서비스 수행 시 산재보험이 의무적으로 적용됩니다. 월 보수액과는 무관하게 배달·퀵 서비스를 1건이라도 수행했다면 0.9%의 산재보험료가 공제됩니다.</Text>
            <Text style={styles.bulletItem}>• 고용보험: ‘고용보험법’ 및 ‘고용산재보험료징수법’ 하위법령의 개정에 따라, 만 65세 미만 월 보수액이 80만 원 이상인 파트너님들에게는 0.9%의 고용보험료가 공제되어요. *월 소득이란 1개월 간 파트너 활동을 통해 발생한 수익금에서 수수료를 제외한 금액입니다. *월 보수액이란 월 소득 - (월 소득 x 필요경비율) 이에요. 필요경비는 노동부에서 고시한 값으로 노무제공자의 기준보수 및 보수액에서 제외하는 금액으로 이후 변동될 수 있습니다. *고용보험료를 부과하는 기준의 보수 하한 값은 월 배달·퀵으로 수행한 월 보수액이 80만 원 이상 133만 원 미만인 경우에는 133만 원으로 책정되어 월 보험료가 산정됩니다. *인출 신청 일자가 아닌 서비스를 수행했던 월을 기준으로 보험료가 산정됩니다.</Text>
          </View>

          {/* 제7조 (정보 및 자료의 제공 등) */}
          <Text style={styles.sectionHeader}>제7조 (정보 및 자료의 제공 등)</Text>
          <Text style={styles.termsText}>
            회사는 위탁 업무와 관련하여 수탁인에게 필요한 정보와 자료를 제공 할 수 있습니다.
          </Text>

          {/* 제8조 (수탁인의 의무) */}
          <Text style={styles.sectionHeader}>제8조 (수탁인의 의무)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무 수행과 관련한 관계 법령, 조례, 행정규칙 등을 준수하여야 합니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무와 관련하여 회사와 고객 등 제3자 간에 분쟁이 발생한 사실 또는 발생할 가능성을 인식하는 경우 그 사실을 48시간 이내에 회사에 통지하여야 합니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무 외의 목적으로 회사의 상호를 사용하거나 회사의 대리점, 임원 또는 직원으로서의 자격을 사칭하여서는 아니됩니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 회사가 요청하는 경우 위탁업무의 수행으로 취득하는 서류, 물건 등 유·무형자산 일체를 지체없이 회사에 전달하여야 합니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무의 수행과 관련하여 지득한 회사의 상품·서비스 기획, 구성, 가격책정 등에 관한 정보, 기타 영업비밀을 침해하여서는 아니됩니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 위탁업무를 제3자에게 재위탁 할 수 없습니다.</Text>
            <Text style={styles.bulletItem}>• 서비스 수행 후 48시간이 지나도록 고객으로부터 물품비 또는 음식비를 이체 받지 못한 경우, 해당 고객을 수사기관에 신고해야 합니다. 회사는 수사기관의 정보 공개 공문 접수 후 수사기관에 해당 고객의 개인정보를 공개할 의무가 있습니다.</Text>
            <Text style={styles.bulletItem}>• 수탁인은 자가용 화물차의 유상운송법을 위반한 서비스를 수행 할 수 없습니다. 만약 위를 위반한 행동이 보일 시 고객센터를 통해 즉시 신고해야 합니다. (*유상운송: 영리를 목적으로 요금이나 대가를 받고 피보험 자동차를 반복적으로 사용하거나 빌려주는 행위 / 승객 또는 화물을 운송하는 경우이며, 현행법상 개인 자가용 차량을 이용한 유상운송은 불법행위로 형사처벌의 대상입니다.)</Text>
          </View>

          {/* 제9조 (위수탁의 해지) */}
          <Text style={styles.sectionHeader}>제9조 (위수탁의 해지)</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 회사 또는 수탁인은 본 계약기간 중 언제든지 문자메세지/SNS 등에 의한 통지로서 본 위수탁 계약을 해지할 수 있습니다. 이 경우 그 해지통지가 상대방에게 도달한 때 즉시 해지됩니다.</Text>
            <Text style={styles.bulletItem}>• 회사 또는 수탁인은 다음 각호의 어느 하나의 경우 통지없이 본 위수탁 계약을 해지할 수 있습니다. 이 경우 즉시 본 계약이 해지됩니다.</Text>
          </View>
          <View style={[styles.bulletList, { marginLeft: 30 }]}>
            <Text style={styles.bulletItem}>1. 본 약관의 동의 및 이에 따른 위수탁 업무의 이행 등과 관련하여 관계법령을 위반한 경우</Text>
            <Text style={styles.bulletItem}>2. 계정생성 및 파트너 지원시 상대방에게 제공한 정보, 자료 등이 위조·변조되거나 허위로 작성된 경우</Text>
            <Text style={styles.bulletItem}>3. 고의 또는 중대한 과실로 본 약관을 위반하는 경우</Text>
            <Text style={styles.bulletItem}>4. 고의 또는 중대한 과실로 분쟁이 야기되어 제3자가 회사 또는 수탁인에게 민사상 소의 제기, 가압류·가처분신청, 형사상 고소·고발 등이 제기되는 경우</Text>
            <Text style={styles.bulletItem}>5. 고객에게 통보 없이 서비스를 미수행하거나, 연락이 두절될 경우</Text>
            <Text style={styles.bulletItem}>6. 서비스 시작 후 수행하지 않거나 취소할 경우, 또는 고객에게 대신 취소를 요청할 경우</Text>
            <Text style={styles.bulletItem}>7. [바로 배달] 서비스를 시작(수락) 하고 10분 내로 수행하지 않을 경우</Text>
            <Text style={styles.bulletItem}>8. 서비스비를 고객에게 추가로 요구하거나 앱을 통하지 않고 따로 지급받을 경우</Text>
            <Text style={styles.bulletItem}>9. 게시물 또는 채팅에 휴대폰 번호, SNS ID, 메신저 ID 등을 기재하여, 어플을 통하지 않고 서비스비를 지급 받고자하는 경우</Text>
            <Text style={styles.bulletItem}>10. 고객의 휴대폰 번호를 저장하여 개인적으로 메신저 또는 문자, 전화로 연락을 주고 받은 경우</Text>
            <Text style={styles.bulletItem}>11. 고객 또는 상담원에게 부적절한 언어를 사용할 경우</Text>
            <Text style={styles.bulletItem}>12. 기타 상호간 신뢰관계를 손상시킬 수 있는 사유가 발생하였다고 회사가 판단한 경우</Text>
          </View>

          {/* 제10조 (손해배상) */}
          <Text style={styles.sectionHeader}>제10조 (손해배상)</Text>
          <Text style={styles.termsText}>
            수탁인은 업무 수행 중 인적 또는 물적 사고가 발생하지 않도록 합리적인 주의를 기울여야 하며, 수탁인은 고의 또는 수탁인의 과실을 원인으로 하는 사고 발생 시 수탁인은 피해 및 사고와 관련된 모든 분쟁은 수탁인의 책임이며, 수탁인의 비용으로 해결하여야 합니다.
          </Text>

          {/* 제11조 (책임보험 등) */}
          <Text style={styles.sectionHeader}>제11조 (책임보험 등)</Text>
          <Text style={styles.termsText}>
            회사는 수탁인이 위탁업무와 관련하여 제3자에게 가할 수 있는 불법행위로 인하여 회사가 부담할 수 있는 손해배상책임을 면책하기 위하여 책임보험 가입 등을 요구할 수 있습니다.
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
});

export default CarrierAgreementScreen;