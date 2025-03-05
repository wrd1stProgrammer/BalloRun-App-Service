import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CartButtonProps {
  onPress: () => void;
  title: string; // 버튼 텍스트 ("장바구니로 이동" 또는 "장바구니에 추가")
  quantity?: number; // 장바구니 개수 (선택 사항)
  price?: number; // 가격 (선택 사항)
}

const CartButton: React.FC<CartButtonProps> = ({ onPress, title, quantity, price }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.cartButton]}
      onPress={onPress}
  
    >
      <Text style={styles.buttonText}>{title}</Text>
      {quantity !== undefined && price !== undefined && (
        <>
          <Text style={styles.buttonText}>{quantity}개 ({price}원)</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;

const styles = StyleSheet.create({
  button: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 16,
  },
  cartButton: {
    backgroundColor: "#d0a6f3",
  },
  addButton: {
    backgroundColor: "#6C63FF",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});