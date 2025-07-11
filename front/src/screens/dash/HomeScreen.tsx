import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import { navigate } from "../../navigation/NavigationUtils";
import {
  selectUser,
  selectIsOngoingOrder,
  setOngoingOrder,
  setIsMatching,
  selectIsMatching,
  selectOngoingOrder,
  clearOngoingOrder,
} from "../../redux/reducers/userSlice";
import { WebSocketContext } from "../../utils/sockets/Socket";
import { countRunnerAction, refetchUser } from "../../redux/actions/userAction";
import Banner from "./Banner/Banner";
import OrderListComponent from "./Banner/OrderListComponent";
import MyAdBanner from "./Banner/MyAdBanner";
import RunnerBox from "./components/RunnerBox";

const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isOngoingOrder = useAppSelector(selectIsOngoingOrder);
  const ongoingOrder = useAppSelector(selectOngoingOrder);
  const isMatching = useAppSelector(selectIsMatching);
  const dispatch = useAppDispatch();
  const orderSocket = useContext(WebSocketContext);

  const [runnerCount, setRunnerCount] = useState<number | null>(null);
  const [runnerLoading, setRunnerLoading] = useState<boolean>(false);

  const displayAddress = user?.address
    ? (() => {
        const parts = user.address.split(" ");
        return parts.length >= 3 ? parts.slice(2).join(" ") : user.address;
      })()
    : "주소를 설정하세요";

  // 주문/소켓 부분 기존 그대로 유지
  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(clearOngoingOrder());
      await dispatch(refetchUser());
    };
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    if (!orderSocket) {
      console.log("orderSocket error");
      return;
    }
    orderSocket.emit("join", user?._id);

    orderSocket.on("order_accepted", (orderData) => {
      console.log("order_accepted 이벤트 수신:", orderData);
      dispatch(setOngoingOrder(orderData));
      dispatch(setIsMatching(true));
    });

    orderSocket.on("order_completed", ({ orderId }) => {
      console.log(`✅ 주문자 화면: 배달 완료 감지 -> 주문 ID: ${orderId}`);
      dispatch(clearOngoingOrder());
    });

    orderSocket.on("emitCancel", ({ orderId, message }) => {
      console.log(`주문자 화면: 배달 캔슬 감지 -> 주문 ID: ${orderId}`);
      console.log(`주문 취소 사유: ${message}`);
      dispatch(clearOngoingOrder());
      alert(`주문이 취소되었습니다.\n주문 ID: ${orderId}\n사유: ${message}`);
    });

    return () => {
      orderSocket.off("order_accepted");
      orderSocket.off("order_completed");
      orderSocket.off("emitCancel");
      console.log("리스너 정리 완료");
    };
  }, [orderSocket, user?._id, dispatch]);

  // 👇 주변 러너 박스 터치 시에만 러너 수 요청
  const handleRunnerBoxPress = async () => {
    if (!user?.address || user?.curLat == null || user?.curLng == null) {
      setRunnerCount(null);
      return;
    }
    setRunnerLoading(true);
    try {
      const response = await dispatch(
        countRunnerAction(user.curLat, user.curLng)
      );
      setRunnerCount(response.count ?? 0);
    } catch (error) {
      setRunnerCount(0);
    }
    setRunnerLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ alignContent: "center" }}
        >
          <View style={styles.headerContainer}>
            <View style={styles.greetingContainer}>
              <TouchableOpacity
                onPress={() => navigate("AddressSettingScreen")}
              >
                <Text
                  style={styles.userName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {displayAddress} ▼
                </Text>
              </TouchableOpacity>
            </View>
            {/* 주변 러너 박스 */}
            <RunnerBox
              runnerCount={runnerCount}
              runnerLoading={runnerLoading}
              onPress={handleRunnerBoxPress}
            />
          </View>

          <View style={styles.bannerContainer}>
            <MyAdBanner />
          </View>
          <Text style={styles.orderNotice}>최신 주문</Text>
          <View style={styles.bannerContainer}>
            <Banner />
          </View>
          <OrderListComponent user={user} />

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerTextt}>
              상호명 SERN(세른) | 대표 채민식 박영서
            </Text>
            <Text style={styles.footerText}>
              통신판매업 신고 2025-광주북구-0416 | 사업자등록번호 418-11-83101
            </Text>
            <Text style={styles.footerText}>
              ballorunrun@gmail.com | 광주광역시 북구 용주로 30번길 88,303호
            </Text>
            <Text style={styles.footerText}>
              전자금융분쟁 Tel 010-4128-4177 / 010-7493-0323
            </Text>
            <Text style={styles.footerText}>
              SERN(세른)은 통신판매중개자로 , 판매자가 등록한 상품정보 및 거래
              등에 대해 발생한 문제는 SERN(세른)에서 해결해드립니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
    margin: 15,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  // 주변 러너 박스 스타일
  runnerBox: {
    backgroundColor: "rgba(38, 166, 154, 0.10)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 3,
    marginLeft: 6,
    minWidth: 84,
  },
  runnerInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  runnerIconCircle: {
    backgroundColor: "#B2DFDB",
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  runnerCountText: {
    fontSize: 17,
    color: "#009688",
    fontWeight: "bold",
  },
  runnerLabel: {
    fontSize: 13,
    color: "#009688",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bannerContainer: {
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
  },
  footerTextContainer: {
    padding: 10,
    marginBottom: 80,
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    textAlign: "left",
    marginLeft: 10,
    marginBottom: 4,
  },
  footerTextt: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    textAlign: "left",
    marginLeft: 10,
    marginBottom: 4,
  },
  orderNotice: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    marginLeft: 18, // 광고 배너와 왼쪽 맞추기
    marginBottom: 0, // 마진 없이
    marginTop: 0,
    letterSpacing: -1,
  },
});
