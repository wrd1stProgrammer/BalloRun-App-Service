import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import OrderList from "./DeliveryRequestListScreenComponents/OrderList"; // ✅ 경로 수정
import DeliveryList from "./DeliveryRequestListScreenComponents/DeliveryList";

const DeliveryRequestListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "deliveries">("orders");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeTab === "orders" && styles.activeButton]}
          onPress={() => setActiveTab("orders")}
        >
          <Text style={styles.buttonText}>나의 주문 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeTab === "deliveries" && styles.activeButton]}
          onPress={() => setActiveTab("deliveries")}
        >
          <Text style={styles.buttonText}>나의 배달 목록</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "orders" ? (
        <OrderList activeTab={activeTab}/>
      ) : (
        <DeliveryList activeTab={activeTab}/>

      )}
    </SafeAreaView>
  );
};


const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#6200ee",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moreButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  pendingStatus: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  inProgressStatus: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  completedStatus: {
    fontSize: 14,
    color: "#6200ee",
    fontWeight: "bold",
  },
  rowFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#333",
  },
  timeInfo: {
    fontSize: 14,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  deliveryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});


export default DeliveryRequestListScreen;