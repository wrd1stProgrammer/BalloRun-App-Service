import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "../../../../navigation/NavigationUtils";
const DeliveryNoticeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>㈜우아한형제들 배달상품 주의사항 동의</Text>
      </View>

      {/* 본문 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}> 배달상품 주의사항 동의</Text>
        <View style={styles.divider} />

        <Text style={styles.body}>
1. 고객님의 주문에 따라 개별적으로 생산 또는 조리된 배달음식은 업주에게 회복할 수 없는 손해가 발생하므로 단순 변심에 의한 청약철회는 할 수 없습니다.{"\n\n"}
2. 고객님과 수차례 연락을 시도한 후 연락이 되지 않는 경우 배달음식이 변질되거나 부패될 우려로 식품위생법상 위반될 여지가 있어 별도로 보관하지 않으며, 재배달 또는 환불처리가 어려울 수 있습니다.{"\n\n"}
3. 배달상품의 주문계약은 구매조건(상품의 내용 및 종류, 가격, 결제수단, 포인트/할인쿠폰 적용여부 등)에 동의하고 주문함으로써 성립합니다. 구매조건에 대한 동의는 고객님께서 과실없이 배달상품을 주문했다는 입증자료로 활용되며, 주문취소 또는 보상이 어려울 수 있으니, 사전에 면밀한 확인 부탁드립니다.{"\n\n"}
4. 고객님은 다음 각호의 귀책사유로 조리된 음식을 수령하지 못하더라도 고객님은 대금지급의무 또는 손해배상금을 부담합니다.{"\n"}
   ① 배달주소지를 고객님의 과실로 잘못 등록하거나 작성한 경우 단, 배달주소지 오류는 재배달 하지 않습니다.{"\n"}
   ② 고객님과 수차례 연락을 시도하였으나 연락이 되지 않는 경우 단, 회사정책에 따라 서비스 이용(ID 정지 등)에 제한이 있을 수 있습니다.{"\n\n"}
5. 만나서 결제 방식을 통해 고객님이 주문할 경우 업주 또는 배달원에게 대금지급을 하지 않을 경우 서비스 이용(ID 정지 등)에 제한이 있을 수 있습니다.{"\n\n"}
6. 배달의민족 앱 내에 등록하여 고객님이 주문한 조리된 음식 등 상품 이외에 다음의 각호와 같이 회사에서 허용(등록)하지 않은 상품 또는 용역행위를 요청한 경우 이행할 수 없는 주문상품으로 판단하여 강제 주문 취소가 진행 될 수 있습니다.{"\n"}
   ① 담배 구매 요청{"\n"}
   ② 배달의민족 앱 내에 등록되지 않은 주류 구매 요청{"\n"}
   ③ 음란물 상품 등 구매 요청{"\n"}
   ④ 기타 용역행위의 요청(세탁물 가져오기, 심부름 등){"\n\n"}
7. 배달의민족 앱 내에 등록된 메뉴 외 요청사항에 고객님께서 작성한 추가 메뉴는 배달상품을 수령하는 시점에 추가메뉴에 대한 상품 배달하지 않으며, 해당 상품의 현장결제를 금지합니다.{"\n\n"}
8. 업주(회사는 메뉴/옵션(상품)을 주문 가능한 상태로 유지하고 있고 주문 불가 시 품절 또는 숨김 처리를 하고 있으나, 업주(회사의 부득이한 영업상 상황에 따라 주문하신 메뉴/옵션(상품) 중 일부 품목의 배달이 어려울 경우 주문이 부분취소될 수 있습니다.{"\n\n"}
9. 부분취소된 품목은 주문 시 결제하신 결제수단으로 환불되며 주문 시 결제수단으로 환불이 불가능할 경우 고객센터를 통해 환불 처리를 도와드립니다.{"\n\n"}
10. 부분취소가 발생할 경우 대상 품목에 사용된 쿠폰금액은 환불되지 않습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 12,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});

export default DeliveryNoticeScreen;
