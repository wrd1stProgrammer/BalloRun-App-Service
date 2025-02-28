import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from "react-native";
import OrderList from "./DeliveryRequestListScreenComponents/OrderList"; // ✅ 경로 수정
import DeliveryList from "./DeliveryRequestListScreenComponents/DeliveryList";
import NewOrderList from "./NewOrder/NewOrderList";

const { width } = Dimensions.get("window");

const DeliveryRequestListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "deliveries">("orders");
  const tabIndicator = useRef(new Animated.Value(0)).current; // ✅ 애니메이션 값 추가

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: activeTab === "orders" ? 0 : width / 2, // ✅ 리스트 → 0, 배달 → width 절반만큼 이동
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ 토글 버튼 디자인 수정 */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setActiveTab("orders")}>
          <Text style={styles.toggleButtonText}>나의 주문 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setActiveTab("deliveries")}>
          <Text style={styles.toggleButtonText}>나의 배달 목록</Text>
        </TouchableOpacity>
        {/* ✅ 애니메이션 적용된 언더라인 */}
        <Animated.View style={[styles.underline, { transform: [{ translateX: tabIndicator }] }]} />
      </View>

      {/* ✅ 컨텐츠 전환 */}
      {activeTab === "orders" ? (
        <NewOrderList activeTab={activeTab} />
      ) : (
        <DeliveryList activeTab={activeTab} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    position: "relative",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  underline: {
    position: "absolute",
    bottom: -2, // ✅ 조금 아래로 위치 조정
    left: 0,
    width: "50%",
    height: 4,
    backgroundColor: "#6C63FF",
  },
});

export default DeliveryRequestListScreen;