import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../navigation/NavigationUtils";

interface HeaderProps {
  title: string;
  showCart?: boolean;
  cartItemCount?: number;
}

const Header: React.FC<HeaderProps> = ({ title, showCart = false, cartItemCount = 0 }) => {
  return (
    <View style={styles.header}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 중앙 제목 */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* 장바구니 아이콘 (없어도 레이아웃 유지) */}
      {showCart ? (
        <TouchableOpacity style={styles.cartButton} onPress={() => navigate("BasketScreen")}>
          <Ionicons name="cart-outline" size={24} color="white" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        // 장바구니 버튼이 없을 때 레이아웃 깨짐 방지용 빈 View 추가
        <View style={styles.emptyCartSpace} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 요소 정렬 유지
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    flex: 1, // 제목을 중앙 정렬하기 위해 flex 적용
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
  emptyCartSpace: {
    width: 40, // 장바구니 버튼과 동일한 크기로 공간 확보
  },
});