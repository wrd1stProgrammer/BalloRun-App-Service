import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { goBack, navigate } from "../../navigation/NavigationUtils";
import cafes  from "../../assets/cafeData/cafeNameData";
const CafeListScreen: React.FC = () => {
  // 더미 데이터: 카페 리스트


  // 각 카페 항목 렌더링
  const renderCafeItem = ({ item }: { item: any }) => (
  
      <TouchableOpacity
        style={styles.cafeItem}
        onPress={() => navigate("CafeMenuListScreen")}
      >
        <Image source={item.icon} style={styles.cafeIcon} />
        <View style={styles.cafeDetails}>
          <Text style={styles.cafeName}>{item.name}</Text>
          <Text style={styles.cafeRating}>⭐ {item.rating}</Text>
        </View>
      </TouchableOpacity>
   
  );

  return (
    <View style={styles.container} >
      {/* 헤더 */}
      <View style={styles.header} >
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문하기</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigate("BasketScreen")}
        >
          <Ionicons name="cart-outline" size={24} color="white" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 카페 리스트 */}
      <Text style={styles.sectionTitle}>주문 가능 카페</Text>
      <FlatList
        data={cafes}
        renderItem={renderCafeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default CafeListScreen;

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  cartButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#A855F7",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  list: {
    paddingBottom: 16,
  },
  cafeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  cafeIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  cafeDetails: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cafeRating: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
