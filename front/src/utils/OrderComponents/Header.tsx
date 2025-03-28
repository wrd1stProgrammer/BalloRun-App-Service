import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../navigation/NavigationUtils";
interface HeaderProps {
  title: string;
  showCart?: boolean;
  cartItemCount?: number;
  showEdit?: boolean;  // 편집 버튼 표시 여부
  onEditPress?: () => void;  // 편집 버튼 클릭 시 실행할 함수
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showCart = false, 
  cartItemCount = 0, 
  showEdit = false, 
  onEditPress 
}) => {
  return (
    <View style={[styles.header, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
<Ionicons name="chevron-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {/* 중앙 제목 */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* 편집 버튼 (옵션) */}
      {showEdit && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editText}>편집</Text>
        </TouchableOpacity>
      )}

      {/* 장바구니 버튼 (옵션) */}
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
    flexGrow: 1,
  },
  cartButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    padding: 8,
    position: "absolute",
    right: 16,
  },
  editText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
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