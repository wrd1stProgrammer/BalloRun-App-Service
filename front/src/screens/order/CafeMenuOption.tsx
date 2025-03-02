import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { goBack } from "../../navigation/NavigationUtils";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import { selectMenu, setMenu } from "../../redux/reducers/menuSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../../utils/OrderComponents/Header";

interface MenuOptionParams {
  menuItem: {
    _id: string;
    imageUrl: string;
    menuName: string;
    description: string;
    price: number;
    cafeName: string;
  };
}

const CafeMenuOption: React.FC = () => {
  const menu = useAppSelector(selectMenu);
  
  const route = useRoute<RouteProp<{ params: MenuOptionParams }>>();
  const { menuItem } = route.params;
  const dispatch = useAppDispatch();

  const [selectedRequiredOption, setSelectedRequiredOption] = useState<string | null>(null);
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<string[]>([]);

  const handleRequiredOptionSelect = (option: string) => {
    setSelectedRequiredOption(option);
  };

  const handleAdditionalOptionToggle = (option: string) => {
    setSelectedAdditionalOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((o) => o !== option)
        : [...prevOptions, option]
    );
  };

  const handleAddToCart = () => {
    if (!selectedRequiredOption) {
      Alert.alert("알림", "필수 옵션을 선택해주세요!");
      return;
    }

    dispatch((dispatch, getState) => {
      const currentMenu = getState().menu;
      const updatedItems = [...currentMenu.items];

      // 동일 메뉴 및 옵션 체크
      const foundIndex = updatedItems.findIndex(
        (selected) =>
          selected._id === menuItem._id &&
          selected.RequiredOption === selectedRequiredOption &&
          JSON.stringify(selected.AdditionalOptions) === JSON.stringify(selectedAdditionalOptions)
      );

      if (foundIndex !== -1) {
        updatedItems[foundIndex] = {
          ...updatedItems[foundIndex],
          quantity: (updatedItems[foundIndex].quantity || 1) + 1,
        };
      } else {
        updatedItems.push({
          ...menuItem,
          quantity: 1,
          RequiredOption: selectedRequiredOption,
          AdditionalOptions: selectedAdditionalOptions,
        });
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

      console.log(menu)
    });

    goBack();
  };

  return (
    <SafeAreaView style={styles.container_1}>
      <Header title={menuItem.menuName} showCart={false} />
    <View style={styles.container}>
      {/* 상단 바 */}
      

      {/* 이미지 */}
      <Image source={{ uri: menuItem.imageUrl }} style={styles.image} />

      {/* 메뉴 정보 */}
      <Text style={styles.title}>{menuItem.menuName}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
      <Text style={styles.price}>{menuItem.price.toLocaleString()}원</Text>

      {/* 필수 옵션 */}
      <Text style={styles.sectionTitle}>필수 옵션</Text>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedRequiredOption === "Ice" && styles.selectedOption,
        ]}
        onPress={() => handleRequiredOptionSelect("Ice")}
      >
        <Text>Ice</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedRequiredOption === "Hot" && styles.selectedOption,
        ]}
        onPress={() => handleRequiredOptionSelect("Hot")}
      >
        <Text>Hot</Text>
      </TouchableOpacity>

      {/* 추가 옵션 */}
      <Text style={styles.sectionTitle}>추가 옵션</Text>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedAdditionalOptions.includes("샷추가") && styles.selectedOption,
        ]}
        onPress={() => handleAdditionalOptionToggle("샷추가")}
      >
        <Text>샷추가 (+500원)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedAdditionalOptions.includes("디카페인 변경") && styles.selectedOption,
        ]}
        onPress={() => handleAdditionalOptionToggle("디카페인 변경")}
      >
        <Text>디카페인 변경 (+500원)</Text>
      </TouchableOpacity>

      {/* 장바구니 추가 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>장바구니에 추가</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  container_1: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    position: "relative",
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
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
  selectedOption: {
    backgroundColor: "#8A67F8",
    borderColor: "#8A67F8",
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
