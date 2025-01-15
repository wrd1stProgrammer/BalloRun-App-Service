import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../redux/config/reduxHook";
import { setMenu } from "../../redux/reducers/menuSlice";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MenuOptionParams {
  menuItem: {
    _id: string;
    imageUrl: string;
    menuName: string;
    description: string;
    price: number;
    cafeName: string; // 추가된 cafeName 필드
  };
}

const CafeMenuOption: React.FC = () => {
  const route = useRoute<RouteProp<{ params: MenuOptionParams }>>();
  const navigation = useNavigation();
  const { menuItem } = route.params;
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch((dispatch, getState) => {
      const currentMenu = getState().menu;
      const updatedItems = [...currentMenu.items];

      const foundIndex = updatedItems.findIndex(
        (selected) => selected._id === menuItem._id
      );

      if (foundIndex !== -1) {
        updatedItems[foundIndex] = {
          ...updatedItems[foundIndex],
          quantity: (updatedItems[foundIndex].quantity || 1) + 1,
        };
      } else {
        updatedItems.push({ ...menuItem, quantity: 1 });
      }

      const totalPrice = updatedItems.reduce(
        (sum, current) => sum + (current.price || 0) * (current.quantity || 1),
        0
      );

      const totalQuantity = updatedItems.reduce(
        (sum, current) => sum + (current.quantity || 1),
        0
      );

      dispatch(
        setMenu({
          items: updatedItems,
          price: totalPrice,
          quantitiy: totalQuantity,
        })
      );
    });

    navigation.goBack();
  };

  return (
    
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{menuItem.cafeName}</Text>
      </View>

      {/* 이미지 */}
      <Image source={{ uri: menuItem.imageUrl }} style={styles.image} />

      {/* 메뉴 정보 */}
      <Text style={styles.title}>{menuItem.menuName}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
      <Text style={styles.price}>{menuItem.price.toLocaleString()}원</Text>

      {/* 필수 옵션 */}
      <Text style={styles.sectionTitle}>필수 옵션</Text>
      <TouchableOpacity style={styles.optionButton}>
        <Text>Ice</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text>Hot</Text>
      </TouchableOpacity>

      {/* 추가 옵션 */}
      <Text style={styles.sectionTitle}>추가 옵션</Text>
      <TouchableOpacity style={styles.optionButton}>
        <Text>샷추가 (+500원)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text>디카페인 변경 (+500원)</Text>
      </TouchableOpacity>

      {/* 장바구니 추가 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>장바구니에 추가</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // 양쪽 정렬
      height: 56, // 상단 바 높이 설정
      position: "relative", // 중앙 정렬을 위한 기준 설정
    },
    backButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      zIndex: 1, // 뒤로 가기 버튼이 텍스트 위로 오도록 설정
    },
    backButtonText: {
      fontSize: 20,
      color: "#8A67F8",
      fontWeight: "bold",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333333",
      position: "absolute", // 중앙 배치
      left: 0,
      right: 0,
      textAlign: "center", // 텍스트를 중앙 정렬
      zIndex: 0, // 뒤로 가기 버튼보다 아래로 설정
    },
    image: {
      width: "100%",
      height: 220,
      borderRadius: 12,
      marginBottom: 16,
      resizeMode: "cover",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333333",
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: "#666666",
      marginBottom: 8,
    },
    price: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#8A67F8",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
      color: "#333333",
    },
    optionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: "#F9F9F9",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    addButton: {
      marginTop: 24,
      paddingVertical: 16,
      backgroundColor: "#8A67F8",
      borderRadius: 8,
      alignItems: "center",
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
  

export default CafeMenuOption;
